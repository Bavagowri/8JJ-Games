// src/hooks/useIsMobile.js
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile (regardless of orientation)
 * Uses multiple detection methods for accuracy
 * @returns {boolean} - true if mobile device, false if desktop
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return checkIfMobile();
  });

  useEffect(() => {
    // Only check on mount and orientation change, not on every resize
    const handleOrientationChange = () => {
      setIsMobile(checkIfMobile());
    };

    // Listen to orientation change instead of resize
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Also listen to resize as fallback (debounced)
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(checkIfMobile());
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    // Set initial state
    handleOrientationChange();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

/**
 * Checks if device is mobile using multiple detection methods
 * @returns {boolean}
 */
function checkIfMobile() {
  if (typeof window === 'undefined') return false;

  // Method 1: User Agent Detection (most reliable for actual device type)
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || navigator.vendor || (navigator.vendor === "Apple Computer, Inc." ? "Opera" : "") : "";
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);

  // Method 2: Touch capability (supplementary check)
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Method 3: Screen size check (use smaller breakpoint for actual mobile devices)
  // Most phones in landscape are still under 1024px
  const maxScreenDimension = typeof window !== "undefined" ? Math.max(window.screen.width, window.screen.height) : 1024;
  const minScreenDimension = typeof window !== "undefined" ? Math.min(window.screen.width, window.screen.height) : 768;
  const isSmallScreen = maxScreenDimension <= 1024 && minScreenDimension <= 768;

  // Combine checks: If user agent says mobile OR (small screen AND touch capable)
  return isMobileUA || (isSmallScreen && hasTouch);
}

