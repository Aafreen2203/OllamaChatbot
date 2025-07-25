import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@apideck/components';
import { 
  Chat, 
  Message, 
  createChat, 
  sendMessage as sendMessageApi, 
  stopStream, 
  getChats, 
  getChatHistory 
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
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
