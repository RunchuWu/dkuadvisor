
import React from 'react';
import { useChatContext } from '@/context/ChatContext';

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
          className="floating-card text-center cursor-pointer hover:shadow-md"
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
