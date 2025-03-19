
import React, { useState, useRef, useEffect } from 'react';
import { ChatProvider, useChatContext, Message } from '@/context/ChatContext';
import ChatSidebar from '@/components/ChatSidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DukeLogo from '@/components/DukeLogo';
import DukeRobot from '@/components/DukeRobot';

const ChatInterface: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { conversations, currentConversationId, isMessageLoading, addMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Find current conversation and its messages
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // Suggestions for quick prompts
  const suggestions = [
    "Tell me about registration schedules",
    "Dance courses",
    "A class about nutrition",
    "Intro computer science class"
  ];
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Auto-open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleSuggestionClick = (suggestion: string) => {
    addMessage(suggestion, 'user');
  };

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <main className={cn(
        "flex-1 flex flex-col h-screen relative bg-white transition-all duration-300",
        isSidebarOpen && !isMobile ? "ml-[280px]" : ""
      )}>
        <ChatHeader setIsSidebarOpen={setIsSidebarOpen} />
        
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          {messages.length > 0 ? (
            <div>
              {messages.map((message: Message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isMessageLoading && (
                <div className="py-5 px-4 md:px-8 lg:px-16 flex">
                  <div className="max-w-3xl w-full mx-auto flex gap-4 md:gap-6">
                    <div className="w-8 h-8 rounded-full bg-duke-blue text-white flex items-center justify-center flex-shrink-0">
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-assistant-light/50 rounded-md w-16 animate-pulse-slight"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center px-4 text-center">
              {isMobile ? (
                <DukeLogo className="mb-8" />
              ) : null}
              
              <h2 className="text-3xl font-duke font-bold mb-2 animate-fade-in text-duke-blue">How can I help you today?</h2>
              <p className="text-assistant-placeholder mb-6 max-w-md animate-fade-in">
                Ask me anything about Duke University or start a conversation. I'm here to assist with information, ideas, and more.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl animate-fade-in">
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index}
                    className="duke-suggestion-card text-left transition-colors text-sm text-gray-700"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full flex justify-center items-start pb-4 pt-2">
          <div className="max-w-3xl w-full flex px-4">
            <div className="w-8 h-8 mr-4 flex items-end justify-center">
              {messages.length === 0 && <DukeRobot />}
            </div>
            <div className="flex-1">
              <ChatInput />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default Index;
