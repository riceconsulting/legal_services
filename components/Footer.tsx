import React from 'react';
import { translations } from '../lib/translations';

interface FooterProps {
  language: 'en' | 'id';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm shadow-inner z-10 border-t border-border-light dark:border-border-dark mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="flex flex-col sm:flex-row justify-center items-center text-center">
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2 sm:mb-0 sm:mr-4">
            {t.contactUsPrompt}
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=6285330168811&text=Hi%2C+I'm+interested+in+discussing+custom+AI+solutions+for+my+legal+practice.&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-accent-teal dark:bg-accent-sky text-white dark:text-primary-navy font-semibold rounded-lg shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-light dark:focus:ring-offset-surface-dark focus:ring-accent-teal dark:focus:ring-accent-sky transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {t.contactUs}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
