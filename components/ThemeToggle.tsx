import React, { useState, useEffect } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  const [isRotating, setIsRotating] = useState(false);

  // Trigger rotation animation on theme change
  useEffect(() => {
    setIsRotating(true);
    const timer = setTimeout(() => setIsRotating(false), 500); // Animation duration
    return () => clearTimeout(timer);
  }, [theme]);
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-main dark:focus:ring-offset-surface-dark focus:ring-accent-teal"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`transition-transform duration-500 ease-in-out ${isRotating ? 'rotate-[360deg]' : ''}`}>
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;