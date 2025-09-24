import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-all duration-300 ease-in-out ${isDragging ? 'border-primary-navy dark:border-primary-gold bg-accent-sky/20 dark:bg-primary-gold/10 scale-105' : 'border-accent-teal dark:border-border-dark hover:border-primary-navy dark:hover:border-primary-gold'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className={`flex flex-col items-center transition-transform duration-300 ${isDragging ? 'scale-95' : 'scale-100'}`}>
        <UploadIcon className="mx-auto h-12 w-12 text-accent-teal dark:text-accent-sky" />
        <span className="mt-4 block text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Drag and drop files here
        </span>
        <span className="mt-1 block text-sm text-text-secondary dark:text-text-secondary-dark">or click to browse</span>
        <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
        />
      </div>
      <div className="mt-4 text-xs text-accent-sky dark:text-text-secondary-dark/70">Supports PDF, DOCX, TXT. AES-256 Encrypted.</div>
    </div>
  );
};

export default FileUpload;