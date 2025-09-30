import React from 'react';
import { translations } from '../lib/translations';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  language: 'en' | 'id';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  language
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ animationDuration: '0.2s' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-background-main dark:bg-surface-dark w-full max-w-md rounded-lg shadow-2xl flex flex-col animate-slide-in-down"
        style={{ animationDuration: '0.3s' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-bold font-heading text-text-primary dark:text-text-primary-dark">
            {title}
          </h2>
          <div className="mt-2 text-text-primary dark:text-text-primary-dark">
            {children}
          </div>
        </div>
        <div className="bg-background-light dark:bg-background-dark/50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-text-primary dark:text-text-primary-dark transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-surface-dark"
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
