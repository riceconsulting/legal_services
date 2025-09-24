import React from 'react';

interface LoaderProps {
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "AI is thinking..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-accent-teal dark:border-accent-sky"></div>
       <p className="text-text-secondary dark:text-text-secondary-dark text-sm animate-pulse">{text}</p>
    </div>
  );
};

export default Loader;