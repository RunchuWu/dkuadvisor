
import React from 'react';

interface DukeRobotProps {
  className?: string;
}

const DukeRobot: React.FC<DukeRobotProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
        <circle cx="50" cy="50" r="45" fill="#012169" />
        <rect x="30" y="30" width="15" height="10" rx="3" fill="#3366CC" />
        <rect x="55" y="30" width="15" height="10" rx="3" fill="#3366CC" />
        <path d="M35 60 C35 70, 65 70, 65 60" stroke="white" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
};

export default DukeRobot;
