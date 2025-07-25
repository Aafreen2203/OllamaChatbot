import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@apideck/components';
import { 
  Chat, 
  Message, 
  createChat, 
  sendMessage as sendMessageApi, 
  stopStream, 
  getChats, 
  getChatHistory,
  deleteChat as deleteChatApi,
  renameChat as renameChatApi
} from './chatApi';

interface ChatContextProps {
  // Current chat state
  currentChat: Chat | null;
  messages: Message[];
  isStreaming: boolean;
  
  // All chats
  chats: Chat[];
  
  // Actions
  createNewChat: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => Promise<void>;
  loadChats: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  copyToClipboard: (text: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { addToast } = useToast();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamController, setStreamController] = useState<AbortController | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const fetchedChats = await getChats();
      setChats(fetchedChats);
      
      // If no current chat and there are chats, select the first one
      if (!currentChat && fetchedChats.length > 0) {
        await selectChat(fetchedChats[0].id);
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to load chats',
        type: 'error',
      });
    }
  };

  const createNewChat = async () => {
    try {
      const newChat = await createChat();
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
      setCurrentStreamingMessage('');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to create new chat',
        type: 'error',
      });
    }
  };

  const selectChat = async (chatId: string) => {
    try {
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return;

      setCurrentChat(chat);
      const chatMessages = await getChatHistory(chatId);
      setMessages(chatMessages);
      setCurrentStreamingMessage('');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to load chat history',
        type: 'error',
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || isStreaming) return;

    try {
      setIsStreaming(true);
      setCurrentStreamingMessage('');

      // Add user message immediately to UI
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId: currentChat.id,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempUserMessage]);

      // Send message and handle streaming
      const controller = await sendMessageApi(
        currentChat.id,
        content,
        (token: string) => {
          setCurrentStreamingMessage(prev => prev + token);
        },
        () => {
          // On complete, refresh the chat history to get the final message from backend
          getChatHistory(currentChat.id).then(chatMessages => {
            setMessages(chatMessages);
            setCurrentStreamingMessage('');
            setIsStreaming(false);
          });
        },
        (error: string) => {
          addToast({
            title: 'Error',
            description: error,
            type: 'error',
          });
          setIsStreaming(false);
          setCurrentStreamingMessage('');
        }
      );

      setStreamController(controller);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to send message',
        type: 'error',
      });
      setIsStreaming(false);
    }
  };

  const stopStreaming = async () => {
    if (!currentChat || !streamController) return;

    try {
      streamController.abort();
      await stopStream(currentChat.id);
      setIsStreaming(false);
      setStreamController(null);
      
      // Refresh chat history to get the partial response
      const chatMessages = await getChatHistory(currentChat.id);
      setMessages(chatMessages);
      setCurrentStreamingMessage('');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to stop streaming',
        type: 'error',
      });
    }
  };

  // Create display messages that include the streaming message
  const displayMessages = React.useMemo(() => {
    if (currentStreamingMessage && isStreaming) {
      const streamingMessage: Message = {
        id: 'streaming',
        chatId: currentChat?.id || '',
        role: 'assistant',
        content: currentStreamingMessage,
        timestamp: new Date().toISOString(),
      };
      return [...messages, streamingMessage];
    }
    return messages;
  }, [messages, currentStreamingMessage, isStreaming, currentChat?.id]);

  // Delete a chat
  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatApi(chatId);
      
      // Remove the chat from the chats list
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If the deleted chat was the current chat, clear it
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        title: '✅ Copied!',
        description: 'Text copied to clipboard successfully',
        type: 'success',
      });
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        addToast({
          title: '✅ Copied!',
          description: 'Text copied to clipboard successfully',
          type: 'success',
        });
      } catch (fallbackError) {
        addToast({
          title: '❌ Error',
          description: 'Failed to copy to clipboard',
          type: 'error',
        });
      }
    }
  };

  // Regenerate AI response
  const regenerateResponse = async (messageId: string) => {
    if (!currentChat || isStreaming) return;

    try {
      // Find the user message that preceded this AI response
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex <= 0) {
        addToast({
          title: '⚠️ Cannot Regenerate',
          description: 'No previous user message found',
          type: 'error',
        });
        return;
      }

      const userMessage = messages[messageIndex - 1];
      if (userMessage.role !== 'user') {
        addToast({
          title: '⚠️ Cannot Regenerate',
          description: 'Previous message is not from user',
          type: 'error',
        });
        return;
      }

      addToast({
        title: '🔄 Regenerating...',
        description: 'Creating a new response',
        type: 'info',
      });

      // Remove the AI response and any messages after it
      const updatedMessages = messages.slice(0, messageIndex);
      setMessages(updatedMessages);

      // Regenerate the response by sending the user message again
      await sendMessage(userMessage.content);
    } catch (error) {
      addToast({
        title: '❌ Error',
        description: 'Failed to regenerate response',
        type: 'error',
      });
    }
  };

  // Rename a chat
  const renameChat = async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      addToast({
        title: '⚠️ Invalid Title',
        description: 'Chat title cannot be empty',
        type: 'error',
      });
      return;
    }

    try {
      const updatedChat = await renameChatApi(chatId, newTitle.trim());
      
      // Update the chats list
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? updatedChat : chat
      ));
      
      // Update current chat if it's the one being renamed
      if (currentChat?.id === chatId) {
        setCurrentChat(updatedChat);
      }

      addToast({
        title: '✅ Renamed Successfully',
        description: `Chat renamed to "${newTitle.trim()}"`,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: '❌ Error',
        description: 'Failed to rename chat',
        type: 'error',
      });
    }
  };

  const value: ChatContextProps = {
    currentChat,
    messages: displayMessages,
    isStreaming,
    chats,
    createNewChat,
    selectChat,
    sendMessage,
    stopStreaming,
    loadChats,
    deleteChat,
    renameChat,
    copyToClipboard,
    regenerateResponse,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
