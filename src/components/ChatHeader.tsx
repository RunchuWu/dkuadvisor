
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Plus } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';

type ChatHeaderProps = {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ setIsSidebarOpen }) => {
  const { createNewConversation, currentConversationId, conversations } = useChatContext();
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const title = currentConversation?.title || 'New conversation';

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
      
      <h1 className="flex-1 font-medium truncate">{title}</h1>
      
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
