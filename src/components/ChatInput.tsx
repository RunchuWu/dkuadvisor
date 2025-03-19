
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Mic, Loader2 } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { addMessage, isMessageLoading, setIsMessageLoading } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (!trimmedInput || isMessageLoading) return;
    
    // Add user message
    addMessage(trimmedInput, 'user');
    setInput('');

    // Simulate AI response
    setIsMessageLoading(true);
    
    setTimeout(() => {
      addMessage("I'm your AI assistant, simulating a response to your message. In a real implementation, this would connect to an actual AI model API to generate a contextual response based on your input.", 'assistant');
      setIsMessageLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-4 py-4 border-t border-assistant-border glassmorphism sticky bottom-0">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto relative"
      >
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 resize-none overflow-hidden bg-white border border-assistant-border rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-assistant-accent focus:border-assistant-accent transition-shadow text-sm min-h-[52px] max-h-[200px]"
            rows={1}
          />
          
          <div className="absolute right-2 flex items-center">
            {input.trim() ? (
              <Button 
                type="submit" 
                size="sm" 
                className={cn(
                  "w-8 h-8 p-0 rounded-full bg-primary hover:bg-primary/90 text-white",
                  isMessageLoading && "opacity-50 cursor-not-allowed"
                )}
                disabled={isMessageLoading}
              >
                {isMessageLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                size="sm" 
                className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-assistant-hover text-assistant-text"
              >
                <Mic size={16} />
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-assistant-placeholder text-center mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
