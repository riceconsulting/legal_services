import React from 'react';
import { translations } from '../lib/translations';

interface FooterProps {
  language: 'en' | 'id';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm shadow-lg z-50 border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="flex flex-col sm:flex-row justify-center items-center text-center">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2 sm:mb-0 sm:mr-4">
            {t.contactUsPrompt}
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=6285330168811&text=Hi%2C+I'm+interested+in+discussing+custom+AI+solutions+for+my+legal+practice.&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-light dark:focus:ring-offset-surface-dark focus:ring-primary-light dark:focus:ring-primary-dark transition-colors duration-200"
          >
            {t.contactUs}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
