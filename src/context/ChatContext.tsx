
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { retrieveContext } from '@/utils/embeddingUtils';

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
  generateAIResponse: (userMessage: string) => Promise<string>;
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
          content: "Hi there! I'm your DKU course advisor. How can I help you find the right courses at Duke Kunshan University today?",
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
          content: "Hi there! I'm your DKU course advisor. How can I help you find the right courses at Duke Kunshan University today?",
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

  // Generate AI response using RAG
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Get relevant documents using RAG
      const relevantDocs = await retrieveContext(userMessage);
      
      // Check if we found any relevant context
      const hasPdfKnowledge = localStorage.getItem('dku-course-pdf') !== null;
      const contextText = relevantDocs.length > 0 
        ? relevantDocs.map(doc => doc.text).join('\n\n')
        : '';
      
      // Call DeepSeek API with the relevant context
      const apiKey = localStorage.getItem('deepseekApiKey');
      if (!apiKey) {
        return "Please set your DeepSeek API key to get AI responses.";
      }
      
      // Prepare system prompt with context
      let systemPrompt = "You are a helpful course advisor for Duke Kunshan University (DKU). ";
      
      if (hasPdfKnowledge && contextText) {
        systemPrompt += "Use the following information from the DKU course catalog to answer the question. If the information doesn't contain the answer, be honest and say you don't know but offer to help with other course-related questions.\n\n";
        systemPrompt += "CONTEXT INFORMATION:\n" + contextText;
      } else if (hasPdfKnowledge) {
        systemPrompt += "I couldn't find specific information about this in the DKU course catalog. I'll try to answer based on general knowledge about universities and courses.";
      } else {
        systemPrompt += "Answer based on general knowledge about universities and courses. Mention that for more specific DKU information, the user should upload a DKU course catalog PDF.";
      }
      
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from DeepSeek API');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm sorry, I encountered an error while generating a response. Please try again.";
    }
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
    generateAIResponse,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
