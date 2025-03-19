
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Plus, Settings, User } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import DukeLogo from './DukeLogo';
import { useIsMobile } from '@/hooks/use-mobile';

type ChatHeaderProps = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ setIsSidebarOpen }) => {
  const { createNewConversation, currentConversationId, conversations, isMessageLoading } = useChatContext();
  const isMobile = useIsMobile();
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const title = currentConversation?.title || 'New conversation';
  
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);

  return (
    <header className="h-16 border-b border-assistant-border flex items-center px-4 glassmorphism sticky top-0 z-10">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2 p-2 h-auto text-duke-blue"
        onClick={() => setIsSidebarOpen(prev => !prev)}
      >
        <Menu size={20} />
      </Button>
      
      {!isMobile && (
        <div className="flex-1 flex justify-center">
          <DukeLogo />
        </div>
      )}
      
      {isMobile ? (
        <h1 className="flex-1 font-medium truncate text-duke-blue">
          {title}
          {isMessageLoading && <span className="ml-2 text-xs text-assistant-placeholder">DeepSeek AI is thinking...</span>}
        </h1>
      ) : (
        <div className="flex items-center">
          {isMessageLoading && <span className="text-xs text-assistant-placeholder">DeepSeek AI is thinking...</span>}
        </div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto text-duke-blue mr-2"
        onClick={() => setShowApiKeyModal(true)}
      >
        <Settings size={18} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto text-duke-blue mr-2"
        onClick={createNewConversation}
      >
        <Plus size={20} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto bg-white rounded-full text-duke-blue"
      >
        <User size={20} />
      </Button>
    </header>
  );
};

export default ChatHeader;
