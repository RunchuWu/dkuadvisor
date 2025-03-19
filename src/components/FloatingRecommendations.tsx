
import React from 'react';
import { useChatContext } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const recommendations = [
  {
    id: 1,
    text: "Tell me about registration schedules",
    delay: "0s"
  },
  {
    id: 2,
    text: "Dance courses",
    delay: "0.2s"
  },
  {
    id: 3,
    text: "A class about nutrition",
    delay: "0.4s"
  },
  {
    id: 4,
    text: "Intro computer science class",
    delay: "0.6s"
  }
];

const FloatingRecommendations: React.FC = () => {
  const { addMessage } = useChatContext();

  const handleRecommendationClick = (text: string) => {
    addMessage(text, 'user');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 px-4">
      {recommendations.map((recommendation) => (
        <button
          key={recommendation.id}
          onClick={() => handleRecommendationClick(recommendation.text)}
          className={cn(
            "bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md dark:shadow-gray-900/30",
            "hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300",
            "backdrop-blur-sm border border-gray-100 dark:border-gray-700",
            "animate-float-up"
          )}
          style={{ 
            animationDelay: recommendation.delay,
            animationDuration: `${3 + (recommendation.id % 2) * 0.5}s`
          }}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation.text}</p>
        </button>
      ))}
    </div>
  );
};

export default FloatingRecommendations;
