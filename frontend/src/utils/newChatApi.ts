const BACKEND_URL = 'http://localhost:5000/api'

export interface Chat {
  id: string
  title: string
  createdAt: string
}

export interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Create a new chat
export const createChat = async (): Promise<Chat> => {
  const response = await fetch(`${BACKEND_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to create chat')
  }

  return response.json()
}

// Send a message and get streaming response
export const sendMessage = async (
  chatId: string,
  content: string,
  onToken: (token: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<AbortController> => {
  const controller = new AbortController()

  try {
    const response = await fetch(`${BACKEND_URL}/chat/${chatId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content }),
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No reader available')
    }

    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            onComplete()
            break
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const token = line.slice(6)
              if (token.trim()) {
                onToken(token)
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          onError(error.message)
        }
      }
    }

    readStream()
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      onError(error.message)
    }
  }

  return controller
}

// Stop streaming
export const stopStream = async (chatId: string): Promise<void> => {
  const response = await fetch(`${BACKEND_URL}/chat/${chatId}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to stop stream')
  }
}

// Get list of chats
export const getChats = async (): Promise<Chat[]> => {
  const response = await fetch(`${BACKEND_URL}/chats`)

  if (!response.ok) {
    throw new Error('Failed to fetch chats')
  }

  return response.json()
}

// Get chat history
export const getChatHistory = async (chatId: string): Promise<Message[]> => {
  const response = await fetch(`${BACKEND_URL}/chat/${chatId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch chat history')
  }

  return response.json()
}
