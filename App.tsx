import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Document } from './types';
import Dashboard from './components/Dashboard';
import DocumentViewer from './components/DocumentViewer';
import Header from './components/Header';
import Footer from './components/Footer';
import { MOCK_DOCUMENTS } from './constants';
import * as geminiService from './services/geminiService';
import { translations } from './lib/translations';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    }
    return 'light';
  });

  const [language, setLanguage] = useState<'en' | 'id'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLang = window.localStorage.getItem('language');
      if (storedLang === 'en' || storedLang === 'id') {
        return storedLang;
      }
    }
    // Default to Bahasa Indonesia if no preference is stored
    return 'id';
  });

  const t = useMemo(() => translations[language], [language]);

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

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'id' : 'en'));
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
            setUploadError(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, or TXT file.`);
            setIsUploading(false);
            return;
        }

        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: 'Perjanjian Kerjasama', // This could be inferred or asked
            date: new Date().toISOString().split('T')[0],
            content: fileContent,
        };
        
        setDocuments(prevDocs => [newDoc, ...prevDocs]);
        navigate(`/document/${newDoc.id}`);
    } catch (error) {
        console.error("Error processing file upload:", error);
        setUploadError(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setIsUploading(false);
    }
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
                language={language}
            />
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} language={language} toggleLanguage={toggleLanguage} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex justify-between items-center">
            <span className="text-sm">{uploadError}</span>
            <button onClick={() => setUploadError(null)} className="ml-2 font-bold hover:text-red-900 dark:hover:text-red-200">×</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={
            <div className="animate-fade-in">
                <Dashboard 
                    documents={documents} 
                    onSelectDocument={handleSelectDocument} 
                    onFileUpload={handleFileUpload}
                    onDeleteDocument={handleDeleteDocument}
                    isUploading={isUploading}
                    language={language}
                />
            </div>
            } 
          />
          <Route path="/document/:documentId" element={<DocumentViewerWrapper />} />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default App;