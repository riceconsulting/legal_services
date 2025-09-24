import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-40 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <a 
              href="https://riceai.net" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-3 group"
            >
              <img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/AGB2yyJJKXfD527r/rice-ai-consulting-2-AoPWxvnWOju2GwOz.png" 
                alt="RICE AI Logo" 
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain" 
              />
            </a>
            <div className="ml-4 flex flex-col leading-tight">
              <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-primary-navy dark:text-text-primary-dark">
                RICE AI
              </h1>
              <p className="font-sans text-xs sm:text-sm text-accent-teal dark:text-accent-sky tracking-wide">
                Legal Service Helper
              </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;