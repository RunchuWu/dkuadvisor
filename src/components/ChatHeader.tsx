
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Plus, Settings } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';

type ChatHeaderProps = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ setIsSidebarOpen }) => {
  const { createNewConversation, currentConversationId, conversations, isMessageLoading } = useChatContext();
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const title = currentConversation?.title || 'New conversation';
  
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);

  return (
    <header className="h-14 border-b border-assistant-border flex items-center px-4 glassmorphism sticky top-0 z-10">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2 p-2 h-auto text-assistant-text"
        onClick={() => setIsSidebarOpen(prev => !prev)}
      >
        <Menu size={20} />
      </Button>
      
      <h1 className="flex-1 font-medium truncate">
        {title}
        {isMessageLoading && <span className="ml-2 text-xs text-assistant-placeholder">DeepSeek AI is thinking...</span>}
      </h1>
      
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto text-assistant-text mr-2"
        onClick={() => setShowApiKeyModal(true)}
      >
        <Settings size={18} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto text-assistant-text"
        onClick={createNewConversation}
      >
        <Plus size={20} />
      </Button>
    </header>
  );
};

export default ChatHeader;
