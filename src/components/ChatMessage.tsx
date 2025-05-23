
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/context/ChatContext';
import { User, Bot } from 'lucide-react';
import CourseResults from './CourseResults';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Function to format code blocks
  const formatContent = (content: string) => {
    // Split by code block markers
    const parts = content.split(/(```[a-zA-Z]*\n[\s\S]*?\n```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const match = part.match(/```([a-zA-Z]*)\n([\s\S]*?)\n```/);
        if (match) {
          const [, language, code] = match;
          return (
            <div key={index} className="bg-gray-800 text-white rounded-md p-3 my-2 overflow-x-auto">
              <pre className="text-sm">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
      }
      
      // Parse for inline code (wrapped in backticks)
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <React.Fragment key={index}>
          {inlineParts.map((inlinePart, i) => {
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              return (
                <code key={i} className="bg-gray-100 text-assistant-text px-1 rounded font-mono text-sm">
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            // Handle line breaks for normal text
            return <span key={i}>{inlinePart.split('\n').map((line, j) => (
              <React.Fragment key={j}>
                {line}
                {j < inlinePart.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}</span>;
          })}
        </React.Fragment>
      );
    });
  };

  // Parse markdown-like syntax for bold (**text**) and italic (*text*)
  const formatRichText = (content: string) => {
    // Format bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Format italic text
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    );
  };

  return (
    <div 
      className={cn(
        "py-5 px-4 md:px-8 lg:px-16 flex animate-fade-in",
        isUser ? "bg-white" : "bg-gray-50"
      )}
    >
      <div className="max-w-3xl w-full mx-auto flex gap-4 md:gap-6">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser ? "bg-gray-200 text-duke-blue" : "bg-duke-blue text-white"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div className="flex-1 prose">
          <div 
            className="text-duke-text leading-relaxed"
          >
            {formatContent(message.content)}
          </div>
          
          {/* Show course cards for assistant messages with course data */}
          {!isUser && message.coursesData && message.coursesData.length > 0 && (
            <div className="mt-4">
              <CourseResults courses={message.coursesData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
