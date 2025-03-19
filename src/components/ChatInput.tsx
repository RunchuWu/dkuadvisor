
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Mic, Loader2 } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { addMessage, isMessageLoading, setIsMessageLoading, generateAIResponse } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('deepseekApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(!localStorage.getItem('deepseekApiKey'));

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
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast.error("Please enter your DeepSeek API key first");
      return;
    }
    
    // Add user message
    addMessage(trimmedInput, 'user');
    setInput('');

    // Get AI response using RAG
    setIsMessageLoading(true);
    
    try {
      const aiResponse = await generateAIResponse(trimmedInput);
      addMessage(aiResponse, 'assistant');
    } catch (error) {
      toast.error((error as Error).message || "Failed to get response from DeepSeek");
      console.error(error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('deepseekApiKey', apiKey);
    setShowApiKeyInput(false);
    toast.success("API Key saved successfully");
  };

  return (
    <div className="px-4 py-4 border-t border-assistant-border dark:border-gray-700 glassmorphism sticky bottom-0">
      {showApiKeyInput ? (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-assistant-border dark:border-gray-700">
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2 dark:text-gray-200">
              Enter your DeepSeek API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 border border-assistant-border dark:border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-assistant-accent dark:focus:ring-blue-500 focus:border-assistant-accent dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="sk-..."
              />
              <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                Save
              </Button>
            </div>
            <p className="text-xs text-assistant-placeholder dark:text-gray-400 mt-2">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowApiKeyInput(true)}
          className="text-xs text-assistant-placeholder dark:text-gray-500 hover:text-assistant-text dark:hover:text-gray-300 underline mb-2 mx-auto block"
        >
          Change API Key
        </button>
      )}

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
            placeholder="Ask about DKU courses..."
            className="flex-1 resize-none overflow-hidden bg-white dark:bg-gray-800 border border-assistant-border dark:border-gray-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-assistant-accent dark:focus:ring-blue-500 focus:border-assistant-accent dark:focus:border-blue-500 transition-shadow text-sm min-h-[52px] max-h-[200px] dark:text-white"
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
                className="w-8 h-8 p-0 rounded-full bg-transparent hover:bg-assistant-hover dark:hover:bg-gray-700 text-assistant-text dark:text-gray-400"
              >
                <Mic size={16} />
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-assistant-placeholder dark:text-gray-400 text-center mt-2">
          AI can make mistakes. Verify important course information.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
