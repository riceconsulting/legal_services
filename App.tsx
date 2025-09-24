
import React, { useState, useEffect } from 'react';
import type { Document, Version } from './types';
import Dashboard from './components/Dashboard';
import DocumentViewer from './components/DocumentViewer';
import Header from './components/Header';
import Footer from './components/Footer';
import { MOCK_DOCUMENTS } from './constants';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleBackToDashboard = () => {
    setSelectedDocument(null);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const firstVersion: Version = {
        version: 1,
        date: new Date().toISOString().split('T')[0],
        content: e.target?.result as string,
      };

      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: 'Perjanjian Kerjasama', // This could be inferred or asked
        versions: [firstVersion],
        draftContent: null,
      };
      
      setDocuments(prevDocs => [newDoc, ...prevDocs]);
      setSelectedDocument(newDoc);
    };
    reader.readAsText(file);
  };

  const handleSaveNewVersion = (documentId: string, newContent: string) => {
    setDocuments(prevDocs => {
      const newDocs = prevDocs.map(doc => {
        if (doc.id === documentId) {
          const latestVersionNumber = doc.versions[0]?.version || 0;
          const newVersion: Version = {
            version: latestVersionNumber + 1,
            // Fix: Corrected typo from newtoISOString to new Date().toISOString()
            date: new Date().toISOString().split('T')[0],
            content: newContent,
          };
          const updatedDoc = {
            ...doc,
            versions: [newVersion, ...doc.versions],
            draftContent: null, // Clear draft when a new version is saved
          };
          // Update the selected document in state if it's the one being edited
          if (selectedDocument?.id === documentId) {
            setSelectedDocument(updatedDoc);
          }
          return updatedDoc;
        }
        return doc;
      });
      return newDocs;
    });
  };

  const handleSaveDraft = (documentId: string, draftContent: string) => {
    setDocuments(prevDocs => {
      const newDocs = prevDocs.map(doc => {
        if (doc.id === documentId) {
           const updatedDoc = {
            ...doc,
            draftContent: draftContent,
          };
           if (selectedDocument?.id === documentId) {
            setSelectedDocument(updatedDoc);
          }
          return updatedDoc;
        }
        return doc;
      });
      return newDocs;
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    // If the currently viewed document is deleted, go back to dashboard
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
    }
  };


  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="p-4 sm:p-6 lg:p-8 pb-24">
        <div key={selectedDocument ? selectedDocument.id : 'dashboard'} className="animate-fade-in">
            {selectedDocument ? (
              <DocumentViewer 
                document={selectedDocument} 
                onBack={handleBackToDashboard} 
                onSaveNewVersion={handleSaveNewVersion}
                onSaveDraft={handleSaveDraft}
              />
            ) : (
              <Dashboard 
                documents={documents} 
                onSelectDocument={handleSelectDocument} 
                onFileUpload={handleFileUpload}
                onDeleteDocument={handleDeleteDocument}
              />
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;