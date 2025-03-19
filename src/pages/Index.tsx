
import React, { useState, useRef, useEffect } from 'react';
import { ChatProvider, useChatContext, Message } from '@/context/ChatContext';
import ChatSidebar from '@/components/ChatSidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import PDFUploader from '@/components/PDFUploader';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DukeLogo from '@/components/DukeLogo';
import DukeRobot from '@/components/DukeRobot';
import DarkModeToggle from '@/components/DarkModeToggle';
import FloatingRecommendations from '@/components/FloatingRecommendations';

const ChatInterface: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { conversations, currentConversationId, isMessageLoading, addMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Find current conversation and its messages
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];
  
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
    <div className="flex h-screen bg-sidebar">
      <ChatSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <main className={cn(
        "flex-1 flex flex-col h-screen relative bg-white dark:bg-background transition-all duration-300",
      )}>
        <div className="absolute top-4 right-16 z-10">
          <DarkModeToggle />
        </div>
        
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
                      <div className="h-6 bg-assistant-light/50 dark:bg-gray-700/50 rounded-md w-16 animate-pulse-slight"></div>
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
              
              <h2 className="text-3xl font-duke font-bold mb-2 animate-fade-in text-duke-blue dark:text-blue-400">DKU Course Advisor</h2>
              <p className="text-assistant-placeholder dark:text-gray-400 mb-6 max-w-md animate-fade-in">
                Ask me anything about courses at Duke Kunshan University. Upload a course catalog PDF to enhance my knowledge.
              </p>
              
              <div className="mb-8 w-full max-w-md animate-fade-in">
                <PDFUploader />
              </div>
              
              <FloatingRecommendations />
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
