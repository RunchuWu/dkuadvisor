
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Mic, Loader2 } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { addMessage, isMessageLoading, setIsMessageLoading } = useChatContext();
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

  const callDeepseekAPI = async (message: string) => {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from DeepSeek API');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw error;
    }
  };

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

    // Get AI response
    setIsMessageLoading(true);
    
    try {
      const aiResponse = await callDeepseekAPI(trimmedInput);
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
    <div className="px-4 py-4 border-t border-assistant-border glassmorphism sticky bottom-0">
      {showApiKeyInput ? (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="bg-white p-4 rounded-lg border border-assistant-border">
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
              Enter your DeepSeek API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 border border-assistant-border rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-assistant-accent focus:border-assistant-accent"
                placeholder="sk-..."
              />
              <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                Save
              </Button>
            </div>
            <p className="text-xs text-assistant-placeholder mt-2">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowApiKeyInput(true)}
          className="text-xs text-assistant-placeholder hover:text-assistant-text underline mb-2 mx-auto block"
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
