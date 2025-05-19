
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    
    onSendMessage(trimmedMessage);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-end border border-gray-200 rounded-lg bg-white overflow-hidden">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about Duke courses..."
          className="flex-1 p-3 pr-10 max-h-32 resize-none outline-none text-sm"
          rows={1}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          variant="ghost"
          size="sm"
          className="absolute bottom-1 right-1 text-duke-blue hover:bg-duke-blue/10 p-2 h-auto"
        >
          <SendHorizontal size={18} />
        </Button>
      </div>
      <div className="text-xs text-gray-500 text-center mt-1">
        This assistant is specifically trained to provide information about Duke University courses.
      </div>
    </div>
  );
};

export default ChatInput;
