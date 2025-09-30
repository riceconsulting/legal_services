import React from 'react';

interface LanguageToggleProps {
  language: 'en' | 'id';
  toggleLanguage: () => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, toggleLanguage }) => {
  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-main dark:focus:ring-offset-surface-dark focus:ring-accent-teal flex items-center justify-center w-10 h-10 font-bold text-sm"
      aria-label="Switch Language"
    >
      {language.toUpperCase()}
    </button>
  );
};

export default LanguageToggle;
