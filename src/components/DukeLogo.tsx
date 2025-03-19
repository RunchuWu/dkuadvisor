
import React from 'react';

interface DukeLogoProps {
  className?: string;
}

const DukeLogo: React.FC<DukeLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <h1 className="text-duke-blue text-4xl md:text-5xl font-duke font-bold">Duke</h1>
    </div>
  );
};

export default DukeLogo;
