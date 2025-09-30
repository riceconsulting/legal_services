import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Document, Risk, Summary, AnalysisType, QnAResponse, PIIConcern } from '../types';
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
import { RedactIcon } from './icons/RedactIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import Tooltip from './Tooltip';
import { translations } from '../lib/translations';

// NEW: Interface for cached results
interface AnalysisResult {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

interface DocumentViewerProps {
  document: Document;
  onBack: () => void;
  language: 'en' | 'id';
}

// UPDATED: AnalysisPanelProps
interface AnalysisPanelProps {
    type: AnalysisType | null;
    analysisResult: AnalysisResult | undefined;
    onRunAnalysis: (
        currentType: AnalysisType, 
        input?: string,
        lang?: 'english' | 'bahasa indonesia'
    ) => void;
    onRegenerate: (type: AnalysisType) => void;
    language: 'en' | 'id';
}


// REFACTORED: AnalysisPanel
const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ type, analysisResult, onRunAnalysis, onRegenerate, language }) => {
    const [inputValue, setInputValue] = useState('');
    const [targetLanguage, setTargetLanguage] = useState<'english' | 'bahasa indonesia'>('english');

    const t = translations[language];

    const ANALYSIS_TITLES: Record<AnalysisType, string> = {
        [AnalysisTypeEnum.SUMMARY]: t.summaryTitle,
        [AnalysisTypeEnum.RISK_ANALYSIS]: t.riskAnalysisTitle,
        [AnalysisTypeEnum.TRANSLATION]: t.translationTitle,
        [AnalysisTypeEnum.QNA]: t.qnaTitle,
        [AnalysisTypeEnum.CLAUSE_EXTRACTION]: t.clauseExtractionTitle,
        [AnalysisTypeEnum.REDACT_PII]: t.piiAnalysisTitle,
    };
    
    const LOADING_MESSAGES: Partial<Record<AnalysisType, string>> = {
        [AnalysisTypeEnum.SUMMARY]: t.loadingSummary,
        [AnalysisTypeEnum.RISK_ANALYSIS]: t.loadingRisk,
        [AnalysisTypeEnum.TRANSLATION]: t.loadingTranslate,
        [AnalysisTypeEnum.QNA]: t.loadingQna,
        [AnalysisTypeEnum.CLAUSE_EXTRACTION]: t.loadingExtract,
        [AnalysisTypeEnum.REDACT_PII]: t.loadingPii,
    };

    // Effect to reset input fields when switching tabs
    useEffect(() => {
        setInputValue('');
    }, [type]);

    const renderResult = () => {
        const isLoading = analysisResult?.isLoading ?? false;
        const error = analysisResult?.error;
        const result = analysisResult?.data;

        if (isLoading && !result) return <div className="flex justify-center items-center h-full p-4"><Loader text={type ? LOADING_MESSAGES[type] : undefined} /></div>;
        if (error) return <div className="text-red-500 p-6 animate-fade-in">{error}</div>;
        
        if (!type) return (
             <div className="p-6 h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <SparklesIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                    {t.aiToolkit}
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-xs">
                    {t.selectAnalysis}
                </p>
            </div>
        );
        
        // Show the result if it exists, otherwise show the trigger UI
        if (!result) {
            const commonButtonClasses = "w-full bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:text-primary-navy dark:hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-base transform hover:scale-105 active:scale-95";

            if (type === AnalysisTypeEnum.SUMMARY) {
                return (
                    <div className="p-6 text-center animate-fade-in space-y-4 pb-16 flex flex-col justify-center h-full">
                        <SummaryIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{t.generateSummaryDesc}</p>
                        <button onClick={() => onRunAnalysis(type)} disabled={isLoading} className={commonButtonClasses}>
                            {isLoading ? <span className="animate-pulse">Generating...</span> : t.generateSummary}
                        </button>
                    </div>
                );
            }
            if (type === AnalysisTypeEnum.RISK_ANALYSIS) {
                return (
                     <div className="p-6 text-center animate-fade-in space-y-4 pb-16 flex flex-col justify-center h-full">
                        <RiskIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{t.analyzeRisksDesc}</p>
                        <button onClick={() => onRunAnalysis(type)} disabled={isLoading} className={commonButtonClasses}>
                            {isLoading ? <span className="animate-pulse">Analyzing...</span> : t.analyzeRisks}
                        </button>
                    </div>
                );
            }
             if (type === AnalysisTypeEnum.REDACT_PII) {
                return (
                    <div className="p-6 text-center animate-fade-in space-y-4 pb-16 flex flex-col justify-center h-full">
                        <RedactIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{t.analyzePiiDesc}</p>
                        <button onClick={() => onRunAnalysis(type)} disabled={isLoading} className={commonButtonClasses}>
                            {isLoading ? <span className="animate-pulse">Analyzing...</span> : t.analyzePii}
                        </button>
                    </div>
                );
            }
            if (type === AnalysisTypeEnum.TRANSLATION) {
                return (
                    <div className="p-4 space-y-4 animate-fade-in pb-16">
                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                                {t.targetLanguage}
                            </label>
                            <div className="flex w-full rounded-lg bg-background-light dark:bg-background-dark p-1 border border-border-light dark:border-border-dark">
                                <button
                                    onClick={() => setTargetLanguage('english')}
                                    className={`w-full rounded-md py-1.5 text-sm font-semibold transition-colors ${targetLanguage === 'english' ? 'bg-accent-teal text-white shadow' : 'text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-dark'}`}
                                >
                                    {t.english}
                                </button>
                                <button
                                    onClick={() => setTargetLanguage('bahasa indonesia')}
                                    className={`w-full rounded-md py-1.5 text-sm font-semibold transition-colors ${targetLanguage === 'bahasa indonesia' ? 'bg-accent-teal text-white shadow' : 'text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-dark'}`}
                                >
                                    {t.bahasaIndonesia}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => onRunAnalysis(type, undefined, targetLanguage)}
                            disabled={isLoading}
                            className="w-full bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:text-primary-navy dark:hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isLoading ? <span className="animate-pulse">Translating...</span> : t.translateDocument}
                        </button>
                    </div>
                );
            }
            if (type === AnalysisTypeEnum.QNA) {
                return (
                    <div className="p-6 h-full flex flex-col items-center justify-center text-center animate-fade-in min-h-[200px]">
                        <QnaIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                            {t.askQuestion}
                        </h3>
                        <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-xs">
                            {t.askQuestionDesc}
                        </p>
                    </div>
                );
            }
            if (type === AnalysisTypeEnum.CLAUSE_EXTRACTION) {
                return (
                    <div className="p-6 h-full flex flex-col items-center justify-center text-center animate-fade-in min-h-[200px]">
                        <ExtractIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                            {t.extractClause}
                        </h3>
                        <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-xs">
                            {t.extractClauseDesc}
                        </p>
                    </div>
                );
            }
            return null;
        }

        // Render actual results
        switch (type) {
            case AnalysisTypeEnum.SUMMARY:
                const summary: Summary = result;
                const keyClausesTitle = language === 'id' ? 'Klausul & Ketentuan Penting' : 'Key Clauses & Terms';
                const executiveSummaryTitle = language === 'id' ? 'Ringkasan Eksekutif' : 'Executive Summary';

                return (
                    <div className="p-4 space-y-4 animate-fade-in pb-16">
                        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-primary-dark">{executiveSummaryTitle}</h3>
                        <p className="text-text-primary dark:text-text-primary-dark text-sm leading-relaxed">{summary?.executive || 'Summary not available.'}</p>
                        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-primary-dark mt-6">{keyClausesTitle}</h3>
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
                if (!Array.isArray(risks) || risks.length === 0) return <div className="p-4 text-green-600 dark:text-green-400 animate-fade-in">{t.noRisksFound}</div>;
                const riskColorMap = { High: 'bg-red-500', Medium: 'bg-yellow-500', Low: 'bg-blue-500', Info: 'bg-gray-500' };
                const riskLevelText = { High: 'High', Medium: 'Medium', Low: 'Low', Info: 'Info' };
                if (language === 'id') {
                    riskLevelText.High = 'Tinggi';
                    riskLevelText.Medium = 'Sedang';
                    riskLevelText.Low = 'Rendah';
                }
                return (
                     <div className="p-4 space-y-4 animate-fade-in pb-16">
                        {risks.map((risk, index) => (
                            <div key={risk.id || `risk-${index}`} className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                                <div className="flex items-center mb-2">
                                    <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${riskColorMap[risk.riskLevel]}`}>{riskLevelText[risk.riskLevel]} Risk</span>
                                </div>
                                <p className="text-text-primary dark:text-text-primary-dark font-semibold">{risk.description}</p>
                                <blockquote className="border-l-4 border-accent-sky dark:border-accent-teal pl-3 my-2 text-sm text-text-secondary dark:text-text-secondary-dark italic">"{risk.clause}"</blockquote>
                                <p className="text-sm"><span className="font-semibold text-green-600 dark:text-green-400">{t.recommendation}:</span> <span className="text-text-primary dark:text-text-primary-dark">{risk.recommendation}</span></p>
                            </div>
                        ))}
                    </div>
                );
            case AnalysisTypeEnum.TRANSLATION:
                 return <div className="p-4 animate-fade-in pb-16"><pre className="whitespace-pre-wrap font-sans text-sm text-text-primary dark:text-text-primary-dark">{result}</pre></div>;
            case AnalysisTypeEnum.REDACT_PII:
                const piiConcerns: PIIConcern[] = result;
                 if (!Array.isArray(piiConcerns) || piiConcerns.length === 0) return <div className="p-4 text-green-600 dark:text-green-400 animate-fade-in">{t.noPiiFound}</div>;
                return (
                    <div className="p-4 space-y-4 animate-fade-in pb-16">
                        {piiConcerns.map((item, index) => (
                             <div key={item.id || `pii-${index}`} className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                                <p className="text-text-primary dark:text-text-primary-dark font-semibold">{item.concern}</p>
                                <blockquote className="border-l-4 border-accent-sky dark:border-accent-teal pl-3 my-2 text-sm text-text-secondary dark:text-text-secondary-dark italic">"{item.pii}"</blockquote>
                                <p className="text-sm"><span className="font-semibold text-green-600 dark:text-green-400">{t.recommendation}:</span> <span className="text-text-primary dark:text-text-primary-dark">{item.recommendation}</span></p>
                            </div>
                        ))}
                    </div>
                );
            case AnalysisTypeEnum.QNA:
                const qnaResponse: QnAResponse = result;
                return (
                    <div className="p-4 space-y-4 animate-fade-in pb-16">
                        <p className="text-text-primary dark:text-text-primary-dark">{qnaResponse.answer}</p>
                        {qnaResponse.quote && (
                            <blockquote className="border-l-4 border-accent-sky dark:border-accent-teal pl-3 my-2 text-sm text-text-secondary dark:text-text-secondary-dark italic">"{qnaResponse.quote}"</blockquote>
                        )}
                    </div>
                );
            case AnalysisTypeEnum.CLAUSE_EXTRACTION:
                return <div className="p-4 animate-fade-in pb-16"><pre className="whitespace-pre-wrap font-sans text-sm text-text-primary dark:text-text-primary-dark">{result}</pre></div>;
            default:
                return null;
        }
    };
    
    const showInput = type === AnalysisTypeEnum.QNA || type === AnalysisTypeEnum.CLAUSE_EXTRACTION;
    const placeholder = type === AnalysisTypeEnum.QNA ? t.qnaPlaceholder : t.clausePlaceholder;
    const isLoading = analysisResult?.isLoading ?? false;

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex-shrink-0 bg-background-light/50 dark:bg-background-dark/30 flex items-center justify-center relative">
            <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-primary-dark text-center">
              {type ? ANALYSIS_TITLES[type] : t.aiToolkit}
            </h3>
            {type && analysisResult?.data && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Tooltip text={isLoading ? t.regenerating : t.regenerateResponse} position="left">
                        <button
                            onClick={() => onRegenerate(type)}
                            disabled={isLoading}
                            className="p-2 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Regenerate response"
                        >
                            <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </Tooltip>
                </div>
            )}
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
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && onRunAnalysis(type, inputValue)}
                        disabled={isLoading}
                    />
                    <button 
                        onClick={() => onRunAnalysis(type, inputValue)}
                        disabled={isLoading}
                        className="bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:text-primary-navy dark:hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
                        {isLoading ? <span className="animate-pulse">...</span> : t.send}
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

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onBack, language }) => {
  const [activeTab, setActiveTab] = useState<AnalysisType | null>(null);
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);
  const [analysisCache, setAnalysisCache] = useState<Partial<Record<AnalysisType, AnalysisResult>>>({});
  const [analysisInputs, setAnalysisInputs] = useState<Partial<Record<AnalysisType, { input?: string; lang?: 'english' | 'bahasa indonesia' }>>>({});


  const documentContentRef = React.useRef<HTMLDivElement>(null);
  const t = translations[language];
  
  useEffect(() => {
    // Reset state when document changes
    setActiveTab(null);
    setHighlightedQuote(null);
    setAnalysisCache({}); // Clear cache for new document
    setAnalysisInputs({});
  }, [document]);
  
  useEffect(() => {
    if (highlightedQuote && documentContentRef.current) {
        // Fix: Use window.document to avoid conflict with the 'document' prop.
        const element = window.document.getElementById('highlighted-quote');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [highlightedQuote]);
  
  // Logic to run analysis, moved from AnalysisPanel
  const handleAnalysis = useCallback(async (
        currentType: AnalysisType, 
        input?: string,
        lang?: 'english' | 'bahasa indonesia'
    ) => {
        // Store the inputs used for this call, so "regenerate" can use them
        setAnalysisInputs(prev => ({ ...prev, [currentType]: { input, lang } }));

        const previousResult = analysisCache[currentType]?.data;

        // Set loading state, preserving previous result during the load
        setAnalysisCache(prev => ({
            ...prev,
            [currentType]: { isLoading: true, error: null, data: previousResult }
        }));
        setHighlightedQuote(null);

        try {
            let res;
            switch (currentType) {
                case AnalysisTypeEnum.SUMMARY:
                    res = await geminiService.generateSummary(document.content, language);
                    break;
                case AnalysisTypeEnum.RISK_ANALYSIS:
                    res = await geminiService.analyzeRisks(document.content, language);
                    break;
                case AnalysisTypeEnum.TRANSLATION:
                    if (!lang) throw new Error("Target language not selected.");
                    res = await geminiService.translateText(document.content, lang);
                    break;
                case AnalysisTypeEnum.QNA:
                     if (!input) throw new Error("Please ask a question.");
                    res = await geminiService.answerQuestion(document.content, input, language);
                    if (res.quote) {
                        setHighlightedQuote(res.quote);
                    }
                    break;
                case AnalysisTypeEnum.CLAUSE_EXTRACTION:
                    if (!input) throw new Error("Please describe the clause to extract.");
                    res = await geminiService.extractClause(document.content, input, language);
                    break;
                case AnalysisTypeEnum.REDACT_PII:
                    res = await geminiService.redactPII(document.content, language);
                    break;
            }
            // Set result on success, replacing previous data
            setAnalysisCache(prev => ({
                ...prev,
                [currentType]: { isLoading: false, error: null, data: res }
            }));
        } catch (err) {
            // Set error on failure, but crucially, RESTORE the previous data
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setAnalysisCache(prev => ({
                ...prev,
                [currentType]: { isLoading: false, error: errorMessage, data: previousResult }
            }));
        }
    }, [document.content, language, analysisCache]);

  const handleRegenerate = useCallback((type: AnalysisType) => {
    const inputs = analysisInputs[type];
    // Re-run analysis with the last known inputs for this type
    handleAnalysis(type, inputs?.input, inputs?.lang);
  }, [analysisInputs, handleAnalysis]);

  const AnalysisButton = ({ type, icon, label, tooltipText }: { type: AnalysisType, icon: React.ReactNode, label: string, tooltipText: string }) => (
    <Tooltip text={tooltipText} position="top">
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
    </Tooltip>
  );

  const renderedContent = useMemo(() => {
    const contentToDisplay = document.content;
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
  }, [document.content, highlightedQuote]);

  return (
    <div className="flex flex-col">
        <div className="flex-shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
                <Tooltip text={t.backToDashboard} position="right">
                    <button onClick={onBack} className="flex items-center text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200">
                        <BackIcon className="h-5 w-5 mr-2" />
                        <span className="hidden sm:inline">{t.back}</span>
                    </button>
                </Tooltip>
                 <h1 className="font-heading text-xl lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark truncate text-center flex-1 min-w-0 sm:hidden mx-2">{document.name}</h1>
            </div>
             <h1 className="font-heading hidden sm:block text-xl lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark truncate text-center flex-1 min-w-0">{document.name}</h1>
            <div className="flex items-center justify-between sm:justify-end gap-2">
                
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-13rem)]">
            {/* Left Pane: Document Viewer */}
            <div className="flex-1 bg-background-main dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden flex flex-col min-w-0">
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-primary-dark">{t.documentText}</h2>
                </div>
                <div ref={documentContentRef} className="p-4 flex-grow lg:overflow-y-auto bg-background-light/50 dark:bg-background-dark/50">
                    {renderedContent}
                </div>
            </div>
            
             {/* Right Pane: AI Toolkit */}
            <div className="lg:w-full lg:max-w-md xl:max-w-lg lg:flex-shrink-0 bg-background-main dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                     <div className="grid grid-cols-3 gap-2">
                        <AnalysisButton type={AnalysisTypeEnum.SUMMARY} icon={<SummaryIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label={t.summaryTitle.replace('AI ', '')} tooltipText="Get a high-level overview and identify key clauses." />
                        <AnalysisButton type={AnalysisTypeEnum.RISK_ANALYSIS} icon={<RiskIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label={t.riskAnalysisTitle.replace('AI ', '')} tooltipText="Identify potential legal risks, ambiguities, and missing clauses." />
                        <AnalysisButton type={AnalysisTypeEnum.REDACT_PII} icon={<RedactIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label={t.piiAnalysisTitle.replace(' Analysis', '')} tooltipText="Identify Personally Identifiable Information (PII) and potential privacy risks." />
                        {/* FIX: Complete the AnalysisButton for Clause Extraction and add missing buttons */}
                        <AnalysisButton type={AnalysisTypeEnum.CLAUSE_EXTRACTION} icon={<ExtractIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label={t.clauseExtractionTitle.replace(' Clause', '')} tooltipText="Find and extract specific legal clauses from the text." />
                        <AnalysisButton type={AnalysisTypeEnum.TRANSLATION} icon={<TranslateIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label={t.translationTitle.replace(' Document', '')} tooltipText="Translate the document into English or Bahasa Indonesia." />
                        <AnalysisButton type={AnalysisTypeEnum.QNA} icon={<QnaIcon className="h-6 w-6 transform transition-transform duration-200 group-hover:scale-110"/>} label={t.qnaTitle.replace('Document ', '')} tooltipText="Ask specific questions about the document's content." />
                     </div>
                </div>
                <AnalysisPanel 
                    type={activeTab}
                    analysisResult={analysisCache[activeTab!]}
                    onRunAnalysis={handleAnalysis}
                    onRegenerate={handleRegenerate}
                    language={language}
                />
            </div>
        </div>
    </div>
  );
};

export default DocumentViewer;
