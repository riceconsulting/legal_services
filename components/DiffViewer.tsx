import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Document } from '../types';

interface DiffViewerProps {
  doc: Document;
  baseVersionIndex: number;
  onClose: () => void;
}

// A simple diffing algorithm (Longest Common Subsequence based)
const diffLines = (textA: string, textB: string) => {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const matrix = Array(linesA.length + 1).fill(null).map(() => Array(linesB.length + 1).fill(0));

  for (let i = 1; i <= linesA.length; i++) {
    for (let j = 1; j <= linesB.length; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const result = [];
  let i = linesA.length, j = linesB.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ line: linesA[i - 1], type: 'common' });
      i--; j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      result.unshift({ line: linesB[j - 1], type: 'added' });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      result.unshift({ line: linesA[i - 1], type: 'removed' });
      i--;
    } else {
      break;
    }
  }
  return result;
};


const DiffViewer: React.FC<DiffViewerProps> = ({ doc, baseVersionIndex, onClose }) => {
  const [compareVersionIndex, setCompareVersionIndex] = useState(
    baseVersionIndex > 0 ? baseVersionIndex - 1 : baseVersionIndex + 1 < doc.versions.length ? baseVersionIndex + 1 : baseVersionIndex
  );
  const [goToLine, setGoToLine] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<number | null>(null);

  // Effect to clear the animation timeout when the component unmounts.
  // This prevents trying to update state on an unmounted component.
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const baseVersion = doc.versions[baseVersionIndex];
  const compareVersion = doc.versions[compareVersionIndex];

  const diffResult = useMemo(() => 
    diffLines(compareVersion.content, baseVersion.content), 
    [compareVersion.content, baseVersion.content]
  );

  const handleGoToLine = () => {
    if (isAnimating) return;
    const line = parseInt(goToLine, 10);
    if (!line || line <= 0 || !rightPaneRef.current) return;

    const el = rightPaneRef.current.querySelector(`[data-line-number="${line}"]`);

    if (el) {
        setIsAnimating(true);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-line');
        
        // Clear any previous timer
        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
        }

        animationTimerRef.current = window.setTimeout(() => {
            el.classList.remove('highlight-line');
            setIsAnimating(false);
        }, 2000);
    }
    setGoToLine(''); // Clear input after jumping
  };

  const diffPanes = useMemo(() => {
    const leftPane: React.ReactElement[] = [];
    const rightPane: React.ReactElement[] = [];
    let lineNumLeft = 1;
    let lineNumRight = 1;
    
    const lineGutter = (lineNum: number) => <span className="w-12 text-right pr-3 text-text-secondary dark:text-text-secondary-dark select-none bg-background-main dark:bg-surface-dark sticky left-0">{lineNum}</span>;
    const emptyGutter = <span className="w-12 bg-background-main dark:bg-surface-dark sticky left-0"></span>;
    const emptyLine = (
        <div className="flex bg-gray-50 dark:bg-black/20 h-6">
            {emptyGutter}
            <div className="flex-1 pl-2"></div>
        </div>
    );

    diffResult.forEach((item, index) => {
        const isRemoved = item.type === 'removed';
        const isAdded = item.type === 'added';
        const isCommon = item.type === 'common';

        if (isCommon) {
            leftPane.push(
                <div key={index} data-line-number={lineNumLeft} className="flex">
                    {lineGutter(lineNumLeft)}
                    <pre className="flex-1 whitespace-pre-wrap pl-2">{item.line || ' '}</pre>
                </div>
            );
            rightPane.push(
                <div key={index} data-line-number={lineNumRight} className="flex">
                    {lineGutter(lineNumRight)}
                    <pre className="flex-1 whitespace-pre-wrap pl-2">{item.line || ' '}</pre>
                </div>
            );
            lineNumLeft++;
            lineNumRight++;
        } else if (isRemoved) {
            leftPane.push(
                <div key={index} data-line-number={lineNumLeft} className="flex bg-red-100 dark:bg-red-500/20">
                    {lineGutter(lineNumLeft)}
                    <pre className="flex-1 whitespace-pre-wrap pl-2">{item.line || ' '}</pre>
                </div>
            );
            rightPane.push(<div key={`${index}-empty`}>{emptyLine}</div>);
            lineNumLeft++;
        } else if (isAdded) {
            leftPane.push(<div key={`${index}-empty`}>{emptyLine}</div>);
            rightPane.push(
                <div key={index} data-line-number={lineNumRight} className="flex bg-green-100 dark:bg-green-500/20">
                    {lineGutter(lineNumRight)}
                    <pre className="flex-1 whitespace-pre-wrap pl-2">{item.line || ' '}</pre>
                </div>
            );
            lineNumRight++;
        }
    });

    return { leftPane, rightPane };
  }, [diffResult]);


  return (
    <>
      <style>{`
        @keyframes highlight-pulse {
            0%   { background-color: transparent; }
            25%  { background-color: var(--highlight-color, rgba(88, 144, 173, 0.7)); }
            50%  { background-color: var(--highlight-color-fade, rgba(88, 144, 173, 0.1)); }
            75%  { background-color: var(--highlight-color, rgba(88, 144, 173, 0.7)); }
            100% { background-color: transparent; }
        }
        .highlight-line {
            --highlight-color: rgba(88, 144, 173, 0.7);
            --highlight-color-fade: rgba(88, 144, 173, 0.1);
            animation: highlight-pulse 2s ease-in-out;
        }
        .dark .highlight-line {
            --highlight-color: rgba(155, 187, 204, 0.6);
            --highlight-color-fade: rgba(155, 187, 204, 0.1);
        }
      `}</style>
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" style={{animationDuration: '0.3s'}} onClick={onClose}>
        <div className="bg-background-main dark:bg-surface-dark w-full max-w-7xl h-[90vh] rounded-lg shadow-2xl flex flex-col animate-slide-in-down" style={{animationDuration: '0.4s'}} onClick={e => e.stopPropagation()}>
          <header className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center flex-wrap gap-2">
            <h2 className="font-heading text-xl font-bold text-text-primary dark:text-text-primary-dark">Compare Versions</h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <label htmlFor="goToLineInput" className="text-sm text-text-secondary dark:text-text-secondary-dark">Go to Line (v{baseVersion.version}):</label>
                  <input 
                      id="goToLineInput"
                      type="number"
                      value={goToLine}
                      onChange={(e) => setGoToLine(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGoToLine()}
                      placeholder="#"
                      className="bg-background-light dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-md px-2 py-1 w-20 text-text-primary dark:text-text-primary-dark placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-sky"
                  />
                  <button 
                    onClick={handleGoToLine} 
                    disabled={isAnimating}
                    className="bg-accent-teal hover:bg-opacity-90 dark:bg-accent-sky dark:text-primary-navy text-white font-bold py-1 px-3 rounded text-sm transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Go
                  </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                  value={compareVersionIndex}
                  onChange={e => setCompareVersionIndex(parseInt(e.target.value))}
                  className="bg-background-light dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-md px-3 py-1.5 text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-sky focus:outline-none"
              >
                  {doc.versions.map((v, index) => (
                      index !== baseVersionIndex && <option key={v.version} value={index}>{v.version}</option>
                  ))}
              </select>
              <span className="text-text-secondary dark:text-text-secondary-dark">vs.</span>
              <div className="bg-gray-200 dark:bg-background-dark text-text-primary dark:text-text-primary-dark rounded-md px-3 py-1.5">
                  Version {baseVersion.version} (Current)
              </div>
              <button onClick={onClose} className="text-2xl font-light text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark">&times;</button>
            </div>
          </header>
          <div className="flex-grow grid grid-cols-2 gap-4 p-4 overflow-hidden text-sm font-mono text-text-primary dark:text-text-primary-dark">
              <div className="overflow-y-auto bg-background-light dark:bg-background-dark rounded-md">
                  <h3 className="font-heading text-center font-bold sticky top-0 bg-background-light dark:bg-surface-dark py-2 z-10 border-b border-border-light dark:border-border-dark">Version {compareVersion.version}</h3>
                  <div className="relative">
                    {diffPanes.leftPane}
                  </div>
              </div>
              <div ref={rightPaneRef} className="overflow-y-auto bg-background-light dark:bg-background-dark rounded-md">
                  <h3 className="font-heading text-center font-bold sticky top-0 bg-background-light dark:bg-surface-dark py-2 z-10 border-b border-border-light dark:border-border-dark">Version {baseVersion.version}</h3>
                  <div className="relative">
                    {diffPanes.rightPane}
                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiffViewer;