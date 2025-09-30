import React, { useState, useMemo } from 'react';
import type { Document } from '../types';
import FileUpload from './FileUpload';
import ConfirmationModal from './ConfirmationModal';
import { DocumentIcon } from './icons/DocumentIcon';
import { SearchIcon } from './icons/SearchIcon';
import { GavelIcon } from './icons/GavelIcon';
import { ScrollIcon } from './icons/ScrollIcon';
import { StampIcon } from './icons/StampIcon';
import { TrashIcon } from './icons/TrashIcon';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import Tooltip from './Tooltip';

interface DashboardProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onFileUpload: (file: File) => void;
  onDeleteDocument: (documentId: string) => void;
  isUploading: boolean;
}

const TypeIcon: React.FC<{ type: string; className: string }> = ({ type, className }) => {
  const lowercasedType = type.toLowerCase();

  switch (true) {
    case lowercasedType.includes('putusan'):
      return <GavelIcon className={className} />;
    case lowercasedType.includes('akta'):
    case lowercasedType.includes('kuasa'):
      return <StampIcon className={className} />;
    case lowercasedType.includes('perjanjian'):
      return <ScrollIcon className={className} />;
    default:
      return <DocumentIcon className={className} />;
  }
};


const Dashboard: React.FC<DashboardProps> = ({ documents, onSelectDocument, onFileUpload, onDeleteDocument, isUploading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  const filteredDocuments = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return documents;
    }
    const lowercasedQuery = trimmedQuery.toLowerCase();
    return documents.filter(doc => {
      const inName = doc.name.toLowerCase().includes(lowercasedQuery);
      const inType = doc.type.toLowerCase().includes(lowercasedQuery);
      const inContent = doc.content.toLowerCase().includes(lowercasedQuery);
      return inName || inType || inContent;
    });
  }, [documents, searchQuery]);

  const handleConfirmDelete = () => {
    if (docToDelete) {
      onDeleteDocument(docToDelete.id);
      setDocToDelete(null);
    }
  };
  
  const DocumentRow: React.FC<ListChildComponentProps> = ({ index, style }) => {
      const doc = filteredDocuments[index];

      return (
          <div style={style}>
              <div 
                  onClick={() => onSelectDocument(doc)} 
                  className="group cursor-pointer hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors duration-200 w-full h-full flex items-center border-b border-border-light dark:border-border-dark"
                  role="button"
                  tabIndex={0}
              >
                  <div className="flex items-center px-4 py-4 sm:px-6 w-full">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <Tooltip text={doc.type} position="right">
                          <TypeIcon type={doc.type} className="h-8 w-8 text-text-secondary dark:text-text-secondary-dark group-hover:text-accent-teal dark:group-hover:text-accent-sky transition-colors" />
                        </Tooltip>
                      </div>
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                           <div className="flex items-center">
                            <p className="truncate font-medium text-text-primary dark:text-text-primary-dark">{doc.name}</p>
                          </div>
                          <p className="mt-1 flex items-center text-sm text-text-secondary dark:text-text-secondary-dark">
                            {doc.type}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                            Last Modified:{' '}
                            <time dateTime={doc.date}>{doc.date}</time>
                          </p>
                        </div>
                      </div>
                    </div>
                     <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
                        <Tooltip text={`Delete ${doc.name}`} position="left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocToDelete(doc);
                            }}
                            className="p-2 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            aria-label={`Delete ${doc.name}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <div className="transform transition-transform group-hover:translate-x-1">
                          <svg className="h-5 w-5 text-accent-sky dark:text-text-secondary-dark" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary dark:text-text-primary-dark">Welcome, Counsel</h1>
        <p className="text-text-secondary dark:text-text-secondary-dark mt-1">Manage your legal documents with the power of AI.</p>
      </div>
      
      <FileUpload onFileUpload={onFileUpload} isProcessing={isUploading} />

      {documents.length > 0 ? (
        <div>
            <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">Recent Projects</h2>
            <div className="relative mb-4 group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" aria-hidden="true" />
            </div>
            <input
                type="search"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 bg-background-main dark:bg-surface-dark py-2.5 pl-10 pr-3 text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark transition-shadow focus:ring-2 focus:ring-inset focus:ring-accent-teal dark:focus:ring-accent-sky sm:text-sm sm:leading-6"
                placeholder="Search by name, type, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
            <div className="bg-background-main dark:bg-surface-dark rounded-lg shadow-md overflow-hidden h-[600px]">
            {filteredDocuments.length > 0 ? (
                <List
                    height={600}
                    itemCount={filteredDocuments.length}
                    itemSize={88}
                    width="100%"
                >
                    {DocumentRow}
                </List>
            ) : (
                <div className="h-full flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
                <SearchIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                    No documents found
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-sm">
                    Your search for "{searchQuery}" did not match any documents. Try a different keyword.
                </p>
                </div>
            )}
            </div>
        </div>
        ) : (
            <div className="text-center py-12 animate-fade-in">
                <DocumentIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                    Your Workspace is Ready
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-sm mx-auto">
                   To get started, upload your first legal document. You can then analyze, identify risks, and ask questions with AI.
                </p>
            </div>
        )}

       <ConfirmationModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to permanently delete the document <strong className="font-semibold">{docToDelete?.name}</strong>? This action cannot be undone.</p>
      </ConfirmationModal>
    </div>
  );
};

export default Dashboard;