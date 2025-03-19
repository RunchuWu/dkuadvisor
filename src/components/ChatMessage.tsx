
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/context/ChatContext';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div 
      className={cn(
        "py-5 px-4 md:px-8 lg:px-16 flex animate-fade-in",
        isUser ? "bg-white" : "bg-assistant-light"
      )}
    >
      <div className="max-w-3xl w-full mx-auto flex gap-4 md:gap-6">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser ? "bg-primary/10 text-primary" : "bg-assistant-accent text-white"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div className="flex-1 prose">
          <div 
            className="text-assistant-text leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
