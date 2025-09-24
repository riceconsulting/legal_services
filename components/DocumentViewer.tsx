import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Document, Risk, Summary, AnalysisType, QnAResponse } from '../types';
import { AnalysisType as AnalysisTypeEnum } from '../types';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { BackIcon } from './icons/BackIcon';
import { SummaryIcon } from './icons/SummaryIcon';
import { RiskIcon } from './icons/RiskIcon';
import { TranslateIcon } from './icons/TranslateIcon';
import { QnaIcon } from './icons/QnaIcon';
import { ExtractIcon } from './icons/ExtractIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface DocumentViewerProps {
  document: Document;
  onBack: () => void;
  onSaveNewVersion: (documentId: string, newContent: string) => void;
  onSaveDraft: (documentId: string, draftContent: string) => void;
}

const ANALYSIS_TITLES: Record<AnalysisType, string> = {
    [AnalysisTypeEnum.SUMMARY]: 'AI Summary',
    [AnalysisTypeEnum.RISK_ANALYSIS]: 'AI Risk Analysis',
    [AnalysisTypeEnum.TRANSLATION]: 'Translate Document',
    [AnalysisTypeEnum.QNA]: 'Document Q&A',
    [AnalysisTypeEnum.CLAUSE_EXTRACTION]: 'Extract Clause',
};

const LOADING_MESSAGES: Partial<Record<AnalysisType, string>> = {
    [AnalysisTypeEnum.SUMMARY]: 'Distilling key points...',
    [AnalysisTypeEnum.RISK_ANALYSIS]: 'Scanning for legal risks...',
    [AnalysisTypeEnum.TRANSLATION]: 'Translating document...',
    [AnalysisTypeEnum.QNA]: 'Searching for the answer...',
    [AnalysisTypeEnum.CLAUSE_EXTRACTION]: 'Extracting relevant clauses...',
};

interface AnalysisPanelProps {
    type: AnalysisType | null;
    documentText: string;
    onReceiveQuote: (quote: string | null) => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ type, documentText, onReceiveQuote }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [inputValue, setInputValue] = useState('');
    const [targetLanguage, setTargetLanguage] = useState<'english' | 'bahasa indonesia'>('english');

    const handleAnalysis = useCallback(async (
        currentType: AnalysisType, 
        input?: string,
        lang?: 'english' | 'bahasa indonesia'
    ) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        onReceiveQuote(null);

        try {
            let res;
            switch (currentType) {
                case AnalysisTypeEnum.SUMMARY:
                    res = await geminiService.generateSummary(documentText);
                    break;
                case AnalysisTypeEnum.RISK_ANALYSIS:
                    res = await geminiService.analyzeRisks(documentText);
                    break;
                case AnalysisTypeEnum.TRANSLATION:
                    if (!lang) { setError("Target language not selected."); return; }
                    res = await geminiService.translateText(documentText, lang);
                    break;
                case AnalysisTypeEnum.QNA:
                     if (!input) { setError("Please ask a question."); return; }
                    res = await geminiService.answerQuestion(documentText, input);
                    if (res.quote) {
                        onReceiveQuote(res.quote);
                    }
                    break;
                case AnalysisTypeEnum.CLAUSE_EXTRACTION:
                    if (!input) { setError("Please describe the clause to extract."); return; }
                    res = await geminiService.extractClause(documentText, input);
                    break;
            }
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [documentText, onReceiveQuote]);

    useEffect(() => {
        setResult(null);
        setError(null);
        setInputValue('');
        onReceiveQuote(null);
        
        const isAutoRun = type && type !== AnalysisTypeEnum.QNA && type !== AnalysisTypeEnum.CLAUSE_EXTRACTION && type !== AnalysisTypeEnum.TRANSLATION;

        if(isAutoRun){
            handleAnalysis(type);
        }
    }, [type, handleAnalysis, onReceiveQuote]);

    const renderResult = () => {
        if (isLoading) return <div className="flex justify-center items-center h-full p-4"><Loader text={type ? LOADING_MESSAGES[type] : undefined} /></div>;
        if (error) return <div className="text-red-500 p-4 animate-fade-in">{error}</div>;
        
        if (!type) return (
             <div className="p-6 h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <SparklesIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                    AI Toolkit
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-xs">
                    Select an analysis from the options above to get started.
                </p>
            </div>
        );

        if (type === AnalysisTypeEnum.TRANSLATION && !result) {
            return (
                <div className="p-4 space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                            Target Language
                        </label>
                        <div className="flex w-full rounded-lg bg-background-light dark:bg-background-dark p-1 border border-border-light dark:border-border-dark">
                            <button
                                onClick={() => setTargetLanguage('english')}
                                className={`w-full rounded-md py-1.5 text-sm font-semibold transition-colors ${targetLanguage === 'english' ? 'bg-accent-teal text-white shadow' : 'text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-dark'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setTargetLanguage('bahasa indonesia')}
                                className={`w-full rounded-md py-1.5 text-sm font-semibold transition-colors ${targetLanguage === 'bahasa indonesia' ? 'bg-accent-teal text-white shadow' : 'text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-dark'}`}
                            >
                                Bahasa Indonesia
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => handleAnalysis(type, undefined, targetLanguage)}
                        disabled={isLoading}
                        className="w-full bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:text-primary-navy dark:hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isLoading ? <span className="animate-pulse">Translating...</span> : 'Translate Document'}
                    </button>
                </div>
            );
        }

        if (!result) {
          if (type === AnalysisTypeEnum.QNA || type === AnalysisTypeEnum.CLAUSE_EXTRACTION) return null;
          return null;
        };

        switch (type) {
            case AnalysisTypeEnum.SUMMARY:
                const summary: Summary = result;
                return (
                    <div className="p-4 space-y-4 animate-fade-in">
                        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-primary-dark">Executive Summary</h3>
                        <p className="text-text-primary dark:text-text-primary-dark text-sm leading-relaxed">{summary?.executive || 'Summary not available.'}</p>
                        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-primary-dark mt-6">Key Clauses & Terms</h3>
                        <ul className="space-y-3">
                            {summary?.keyClauses && Array.isArray(summary.keyClauses) ? (
                                summary.keyClauses.map((clause, index) => (
                                    <li key={index} className="bg-background-light dark:bg-background-dark p-3 rounded-md">
                                        <p className="font-semibold text-text-primary dark:text-text-primary-dark">{clause.title}</p>
                                        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">{clause.detail}</p>
                                    </li>
                                ))
                            ) : (
                                <li className="text-text-secondary dark:text-text-secondary-dark text-sm p-3">No key clauses were identified.</li>
                            )}
                        </ul>
                    </div>
                );
            case AnalysisTypeEnum.RISK_ANALYSIS:
                const risks: Risk[] = result;
                if (!Array.isArray(risks) || risks.length === 0) return <div className="p-4 text-green-600 dark:text-green-400 animate-fade-in">No significant risks found.</div>;
                const riskColorMap = { High: 'bg-red-500', Medium: 'bg-yellow-500', Low: 'bg-blue-500', Info: 'bg-gray-500' };
                return (
                     <div className="p-4 space-y-4 animate-fade-in">
                        {risks.map((risk, index) => (
                            <div key={risk.id || `risk-${index}`} className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                                <div className="flex items-center mb-2">
                                    <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${riskColorMap[risk.riskLevel]}`}>{risk.riskLevel} Risk</span>
                                </div>
                                <p className="text-text-primary dark:text-text-primary-dark font-semibold">{risk.description}</p>
                                <blockquote className="border-l-4 border-accent-sky dark:border-accent-teal pl-3 my-2 text-sm text-text-secondary dark:text-text-secondary-dark italic">"{risk.clause}"</blockquote>
                                <p className="text-sm"><span className="font-semibold text-green-600 dark:text-green-400">Recommendation:</span> <span className="text-text-primary dark:text-text-primary-dark">{risk.recommendation}</span></p>
                            </div>
                        ))}
                    </div>
                );
            case AnalysisTypeEnum.TRANSLATION:
                 return <div className="p-4 animate-fade-in"><pre className="whitespace-pre-wrap font-sans text-sm text-text-primary dark:text-text-primary-dark">{result}</pre></div>;
            case AnalysisTypeEnum.QNA:
                const qnaResponse: QnAResponse = result;
                return (
                    <div className="p-4 space-y-4 animate-fade-in">
                        <p className="text-text-primary dark:text-text-primary-dark">{qnaResponse.answer}</p>
                        {qnaResponse.quote && (
                            <blockquote className="border-l-4 border-accent-sky dark:border-accent-teal pl-3 my-2 text-sm text-text-secondary dark:text-text-secondary-dark italic">"{qnaResponse.quote}"</blockquote>
                        )}
                    </div>
                );
            case AnalysisTypeEnum.CLAUSE_EXTRACTION:
                return <div className="p-4 animate-fade-in"><pre className="whitespace-pre-wrap font-sans text-sm text-text-primary dark:text-text-primary-dark">{result}</pre></div>;
            default:
                return null;
        }
    };
    
    const showInput = type === AnalysisTypeEnum.QNA || type === AnalysisTypeEnum.CLAUSE_EXTRACTION;
    const placeholder = type === AnalysisTypeEnum.QNA ? "Ask a question about the document..." : "Describe the clause to find, e.g., 'termination clause'";

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex-shrink-0 bg-background-light/50 dark:bg-background-dark/30">
            <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-primary-dark text-center">
              {type ? ANALYSIS_TITLES[type] : 'AI Toolkit'}
            </h3>
        </div>
        {showInput && (
            <div className="p-4 border-b border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/30">
                <div className="flex space-x-2">
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="flex-grow bg-background-main dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-md px-3 py-2 text-text-primary dark:text-text-primary-dark placeholder-text-secondary dark:placeholder-text-secondary-dark focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-sky focus:outline-none transition-shadow"
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAnalysis(type, inputValue)}
                        disabled={isLoading}
                    />
                    <button 
                        onClick={() => handleAnalysis(type, inputValue)}
                        disabled={isLoading}
                        className="bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:text-primary-navy dark:hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
                        {isLoading ? <span className="animate-pulse">...</span> : 'Send'}
                    </button>
                </div>
            </div>
        )}
        <div className="flex-grow overflow-y-auto">
          {renderResult()}
        </div>
      </div>
    );
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onBack, onSaveNewVersion, onSaveDraft }) => {
  const [activeTab, setActiveTab] = useState<AnalysisType | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);

  const documentContentRef = React.useRef<HTMLDivElement>(null);
  
  const currentVersion = document.versions[selectedVersionIndex];

  useEffect(() => {
    // Reset state and auto-load draft when document changes
    setSelectedVersionIndex(0);
    setActiveTab(null);
    setHighlightedQuote(null);
    if (document.draftContent) {
        setEditedContent(document.draftContent);
        setIsEditing(true);
    } else {
        setEditedContent(currentVersion?.content || '');
        setIsEditing(false);
    }
  }, [document, currentVersion?.content]);
  
  useEffect(() => {
    if (highlightedQuote && documentContentRef.current) {
        // Fix: Use window.document to avoid conflict with the 'document' prop.
        const element = window.document.getElementById('highlighted-quote');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [highlightedQuote]);

  const handleEdit = () => {
    // Load draft if it exists, otherwise load current version content
    setEditedContent(document.draftContent ?? currentVersion.content);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    // If there was a draft, keep it in the editor but exit editing mode for viewing
    if (document.draftContent) {
        setEditedContent(document.draftContent);
    } else {
        setEditedContent(currentVersion.content);
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    onSaveNewVersion(document.id, editedContent);
    setIsEditing(false);
  };
  
  const handleSaveDraft = () => {
    onSaveDraft(document.id, editedContent);
    // Optionally, you can add a visual confirmation here
  };

  const handleQuote = (quote: string | null) => {
    setHighlightedQuote(quote);
  };

  const AnalysisButton = ({ type, icon, label }: {type: AnalysisType, icon: React.ReactNode, label: string}) => (
     <button 
        onClick={() => setActiveTab(type)} 
        className={`group relative flex flex-col items-center justify-center p-3 space-y-1 w-full text-center rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-dark focus:ring-accent-teal dark:focus:ring-accent-sky ${
        activeTab === type 
        ? 'bg-gradient-to-br from-accent-teal to-sky-600 text-white dark:from-accent-sky dark:to-accent-teal dark:text-white shadow-xl scale-105' 
        : 'bg-background-light dark:bg-surface-dark/50 hover:bg-accent-sky/30 dark:hover:bg-accent-teal/20 text-text-secondary dark:text-text-secondary-dark'
        }`}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const renderedContent = useMemo(() => {
    const contentToDisplay = currentVersion.content;
    if (!highlightedQuote) {
      return <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary dark:text-text-primary-dark">{contentToDisplay}</pre>;
    }
    const parts = contentToDisplay.split(highlightedQuote);
    return (
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary dark:text-text-primary-dark">
        {parts[0]}
        <mark id="highlighted-quote" className="bg-yellow-300 dark:bg-accent-sky/50 text-black dark:text-white px-1 rounded transition-all duration-300">
          {highlightedQuote}
        </mark>
        {parts[1]}
      </pre>
    );
  }, [currentVersion.content, highlightedQuote]);

  return (
    <div className="flex flex-col">
        <div className="flex-shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
                <button onClick={onBack} className="flex items-center text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200">
                    <BackIcon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
                 <h1 className="font-heading text-xl lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark truncate text-center flex-1 min-w-0 sm:hidden mx-2">{document.name}</h1>
            </div>
             <h1 className="font-heading hidden sm:block text-xl lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark truncate text-center flex-1 min-w-0">{document.name}</h1>
            <div className="flex items-center justify-between sm:justify-end gap-2">
                <select 
                  value={selectedVersionIndex}
                  onChange={(e) => setSelectedVersionIndex(parseInt(e.target.value, 10))}
                  className="bg-background-main dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-md px-3 py-2 text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-sky focus:outline-none transition-shadow"
                  disabled={isEditing}
                >
                  {document.versions.map((v, index) => (
                    <option key={v.version} value={index}>
                      V{v.version} ({v.date})
                    </option>
                  ))}
                </select>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-13rem)]">
            {/* Left Pane: Document Viewer/Editor */}
            <div className="flex-1 bg-background-main dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden flex flex-col min-w-0">
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-primary-dark">Document Text</h2>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm transition-all transform hover:scale-105 active:scale-95">Cancel</button>
                          <button onClick={handleSaveDraft} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm transition-all transform hover:scale-105 active:scale-95">Save Draft</button>
                          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm transition-all transform hover:scale-105 active:scale-95">Save as New Version</button>
                        </>
                      ) : (
                        <button onClick={handleEdit} className="bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:hover:bg-opacity-90 dark:text-primary-navy text-white font-bold py-1 px-3 rounded text-sm transition-all transform hover:scale-105 active:scale-95">Edit</button>
                      )}
                    </div>
                </div>
                <div ref={documentContentRef} className="p-4 flex-grow lg:overflow-y-auto bg-background-light/50 dark:bg-background-dark/50">
                    {isEditing ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-full min-h-[70vh] lg:min-h-0 bg-transparent text-text-primary dark:text-text-primary-dark font-sans text-sm resize-none focus:outline-none animate-fade-in"
                      />
                    ) : (
                      renderedContent
                    )}
                </div>
            </div>
            
             {/* Right Pane: AI Toolkit */}
            <div className="lg:w-full lg:max-w-md xl:max-w-lg lg:flex-shrink-0 bg-background-main dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                     <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-2">
                        <AnalysisButton type={AnalysisTypeEnum.SUMMARY} icon={<SummaryIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label="Summary" />
                        <AnalysisButton type={AnalysisTypeEnum.RISK_ANALYSIS} icon={<RiskIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label="Risks" />
                        <AnalysisButton type={AnalysisTypeEnum.CLAUSE_EXTRACTION} icon={<ExtractIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label="Extract" />
                        <AnalysisButton type={AnalysisTypeEnum.TRANSLATION} icon={<TranslateIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label="Translate" />
                        <AnalysisButton type={AnalysisTypeEnum.QNA} icon={<QnaIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label="Q&A" />
                    </div>
                </div>
                <div className="flex-grow overflow-hidden">
                    <AnalysisPanel type={activeTab} documentText={currentVersion.content} onReceiveQuote={handleQuote} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default DocumentViewer;