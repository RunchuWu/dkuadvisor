
import React from 'react';
import { Button } from "@/components/ui/button";
import { PenSquare, ChevronLeft, MessageSquare, Clock, Settings } from 'lucide-react';
import { useChatContext, Conversation } from '@/context/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatSidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { conversations, currentConversationId, createNewConversation, setCurrentConversationId } = useChatContext();
  const isMobile = useIsMobile();

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const ConversationItem: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    const isActive = conversation.id === currentConversationId;
    
    return (
      <button
        onClick={() => {
          setCurrentConversationId(conversation.id);
          if (isMobile) setIsSidebarOpen(false);
        }}
        className={cn(
          "w-full text-left px-3 py-3 rounded-md transition-all duration-200 group flex items-start mb-1",
          isActive 
            ? "bg-assistant-accent/10 text-assistant-accent hover:bg-assistant-accent/15" 
            : "hover:bg-assistant-hover text-assistant-text"
        )}
      >
        <MessageSquare size={18} className="mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate">{conversation.title}</span>
          <span className="text-xs opacity-60">{formatDate(conversation.timestamp)}</span>
        </div>
      </button>
    );
  };

  if (!isSidebarOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:static lg:z-0",
      isMobile ? "animate-fade-in" : ""
    )}>
      <aside className={cn(
        "h-full w-[280px] bg-sidebar flex flex-col border-r border-assistant-border animate-slide-up",
        isMobile ? "absolute" : "relative"
      )}>
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            className="p-2 h-auto hover:bg-assistant-hover rounded-md"
            onClick={createNewConversation}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <PenSquare size={16} />
              New chat
            </span>
          </Button>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 h-auto"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ChevronLeft size={18} />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto thin-scrollbar px-2 py-2">
          <div className="mb-4">
            <h3 className="text-xs font-medium text-assistant-placeholder uppercase tracking-wider px-3 py-1">Recent conversations</h3>
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <ConversationItem 
                  key={conversation.id} 
                  conversation={conversation} 
                />
              ))
            ) : (
              <p className="text-sm text-assistant-placeholder px-3 py-2">No conversations yet</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-assistant-border p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-assistant-text mb-2"
          >
            <Clock size={16} className="mr-2" />
            <span className="text-sm">Previous 30 Days</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-assistant-text"
          >
            <Settings size={16} className="mr-2" />
            <span className="text-sm">Settings</span>
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default ChatSidebar;
