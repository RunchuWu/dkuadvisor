
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
};

type ChatContextType = {
  conversations: Conversation[];
  currentConversationId: string | null;
  isMessageLoading: boolean;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsMessageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  createNewConversation: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Welcome',
      messages: [
        {
          id: 'welcome-message',
          content: "Hi there! I'm your AI assistant powered by DeepSeek AI. How can I help you today?",
          role: 'assistant',
          timestamp: new Date(),
        }
      ],
      timestamp: new Date(),
    },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>('1');
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const createNewConversation = () => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: 'New conversation',
      messages: [
        {
          id: 'welcome-message',
          content: "Hi there! I'm your AI assistant powered by DeepSeek AI. How can I help you today?",
          role: 'assistant',
          timestamp: new Date(),
        }
      ],
      timestamp: new Date(),
    };
    
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newId);
  };

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    if (!currentConversationId) return;
    
    const newMessage: Message = {
      id: generateId(),
      content,
      role,
      timestamp: new Date(),
    };
    
    setConversations((prev) => 
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          // Update conversation title if this is the first user message and the only message is the welcome message
          const isFirstUserMessage = conv.messages.length === 1 && 
                                    conv.messages[0].id === 'welcome-message' && 
                                    role === 'user';
          
          const title = isFirstUserMessage ? content.substring(0, 30) + (content.length > 30 ? '...' : '') : conv.title;
          
          return {
            ...conv,
            title,
            messages: [...conv.messages, newMessage],
            timestamp: new Date(),
          };
        }
        return conv;
      })
    );
  };

  const value = {
    conversations,
    currentConversationId,
    isMessageLoading,
    setConversations,
    setCurrentConversationId,
    setIsMessageLoading,
    addMessage,
    createNewConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
