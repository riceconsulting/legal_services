import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Effect to clean up the timeout when the component unmounts.
  // This prevents memory leaks and React warnings about setting state on unmounted components.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Clear any existing timer to avoid flicker on quick mouse out/in
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay before showing
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };
  
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !wrapperRef.current) {
      return;
    }

    const tooltipEl = tooltipRef.current;
    const triggerEl = wrapperRef.current;
    
    const calculateAndSetPosition = () => {
      const triggerRect = triggerEl.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 10;
      
      let finalPosition = position;
      let top = 0;
      let left = 0;

      const pos = {
        top: () => {
          top = triggerRect.top - tooltipRect.height - gap;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        },
        bottom: () => {
          top = triggerRect.bottom + gap;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        },
        left: () => {
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - gap;
        },
        right: () => {
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + gap;
        },
      };

      pos[finalPosition](); // Calculate initial position

      // --- Collision Detection & Flipping ---
      if (finalPosition === 'top' && top < 0) finalPosition = 'bottom';
      if (finalPosition === 'bottom' && top + tooltipRect.height > viewportHeight) finalPosition = 'top';
      if (finalPosition === 'left' && left < 0) finalPosition = 'right';
      if (finalPosition === 'right' && left + tooltipRect.width > viewportWidth) finalPosition = 'left';

      // Recalculate if flipped
      if (finalPosition !== position) {
        pos[finalPosition]();
      }

      // --- Final Boundary Adjustments ---
      if (left < gap) {
          left = gap;
      }
      if (left + tooltipRect.width > viewportWidth - gap) {
          left = viewportWidth - tooltipRect.width - gap;
      }
      if (top < gap) {
          top = gap;
      }
      if (top + tooltipRect.height > viewportHeight - gap) {
          top = viewportHeight - tooltipRect.height - gap;
      }
      
      setStyle({ top: `${top}px`, left: `${left}px` });
    };

    // Calculate position on the next frame to ensure the tooltip element has been rendered and has dimensions
    requestAnimationFrame(calculateAndSetPosition);

  }, [isVisible, position, text]); // re-calculate if text or position props change while visible

  const TooltipContent = isVisible ? ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      role="tooltip"
      style={{ ...style, position: 'fixed', zIndex: 100 }}
      className={`
        w-max max-w-xs rounded-lg bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5
        text-sm font-medium text-white dark:text-text-primary-dark text-center shadow-xl
        whitespace-normal animate-tooltip-fade-in
      `}
    >
      {text}
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center"
    >
      {children}
      {TooltipContent}
    </div>
  );
};

export default Tooltip;