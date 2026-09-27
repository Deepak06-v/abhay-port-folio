/*!
  PageLoader - Phase 15
  Minimal lightweight page load experience
*/

import { useEffect, useRef, useState } from 'react';

const PageLoader = ({ duration = 800 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Automatically hide loader after duration or when DOM is ready
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }, duration);

    // Hide loader when all critical resources are loaded
    const handleLoad = () => {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    };

    // Check if already loaded
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [duration]);

  if (!isLoading) {
    return null;
  }

  // Minimal loader content
  return (
    <div
      className="page-loader"
      aria-label="Page loading"
      role="status"
    >
      <div className="page-loader-content">
        <span className="page-loader-text">ABHAY</span>
      </div>
    </div>
  );
};

export default PageLoader;