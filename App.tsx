
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Document, Version } from './types';
import Dashboard from './components/Dashboard';
import DocumentViewer from './components/DocumentViewer';
import Header from './components/Header';
import Footer from './components/Footer';
import { MOCK_DOCUMENTS } from './constants';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [isUploading, setIsUploading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    }
    return 'light';
  });
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate(`/document/${doc.id}`);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
        let fileContent = '';

        const supportedBinaryTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (file.type.startsWith('text/')) {
            fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = (e) => reject(reader.error);
                reader.readAsText(file);
            });
        } else if (supportedBinaryTypes.includes(file.type)) {
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    const base64String = dataUrl.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = (e) => reject(reader.error);
                reader.readAsDataURL(file);
            });
            fileContent = await geminiService.extractTextFromFile(base64Data, file.type);
        } else {
            alert(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, or TXT file.`);
            setIsUploading(false);
            return;
        }

        const firstVersion: Version = {
            version: 1,
            date: new Date().toISOString().split('T')[0],
            content: fileContent,
        };

        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: 'Perjanjian Kerjasama', // This could be inferred or asked
            versions: [firstVersion],
            draftContent: null,
        };
        
        setDocuments(prevDocs => [newDoc, ...prevDocs]);
        navigate(`/document/${newDoc.id}`);
    } catch (error) {
        console.error("Error processing file upload:", error);
        alert(`An error occurred while processing the file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setIsUploading(false);
    }
  };


  const handleSaveNewVersion = (documentId: string, newContent: string) => {
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (doc.id === documentId) {
          const latestVersionNumber = doc.versions[0]?.version || 0;
          const newVersion: Version = {
            version: latestVersionNumber + 1,
            date: new Date().toISOString().split('T')[0],
            content: newContent,
          };
          return {
            ...doc,
            versions: [newVersion, ...doc.versions],
            draftContent: null, // Clear draft when a new version is saved
          };
        }
        return doc;
      });
    });
  };

  const handleSaveDraft = (documentId: string, draftContent: string) => {
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (doc.id === documentId) {
           return {
            ...doc,
            draftContent: draftContent,
          };
        }
        return doc;
      });
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    if (location.pathname.includes(`/document/${documentId}`)) {
      navigate('/');
    }
    setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
  };
  
  const DocumentViewerWrapper = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const document = documents.find(d => d.id === documentId);

    useEffect(() => {
        // If document is not found (e.g., after deletion or bad link), redirect to dashboard
        if (!document) {
            navigate('/');
        }
    }, [document, navigate]);

    if (!document) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="animate-fade-in">
            <DocumentViewer 
                key={document.id}
                document={document} 
                onBack={() => navigate('/')} 
                onSaveNewVersion={handleSaveNewVersion}
                onSaveDraft={handleSaveDraft}
            />
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="p-4 sm:p-6 lg:p-8 pb-24">
        <Routes>
          <Route path="/" element={
            <div className="animate-fade-in">
                <Dashboard 
                    documents={documents} 
                    onSelectDocument={handleSelectDocument} 
                    onFileUpload={handleFileUpload}
                    onDeleteDocument={handleDeleteDocument}
                    isUploading={isUploading}
                />
            </div>
            } 
          />
          <Route path="/document/:documentId" element={<DocumentViewerWrapper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;