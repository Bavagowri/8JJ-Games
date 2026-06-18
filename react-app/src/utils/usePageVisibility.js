
/* react-app/src/utils/usePageVisibility.js */
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the page/tab is visible or hidden
 * Returns true when page is visible, false when hidden
 * 
 * Usage:
 * const isVisible = usePageVisibility();
 * 
 * Use this to pause animations, intervals, or API calls when user switches tabs
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}