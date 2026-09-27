/*!
  useScrollReveal - Phase 12
  Reusable scroll reveal hook with GSAP
*/

import { useRef, useEffect, useState } from 'react';

const isSupported = typeof window !== 'undefined';

export function useScrollReveal(options = {}) {
  const { distance = '200px', origin = 'top', threshold = 0.2, viewElement = null, once = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;

    const element = elementRef.current || viewElement;

    if (!element) return;

    const observe = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const elementVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
      if (elementVisible) {
        setIsVisible(true);
        if (once) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
                }
              });
            },
            { root: null, rootMargin: distance, threshold }
          );
          observer.observe(element);
        }
      };

      observe();

      const handleScroll = () => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const elementVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        if (elementVisible && !isVisible) {
          setIsVisible(true);
        }
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
        if (once) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
                }
              });
            },
            { root: null, rootMargin: distance, threshold }
          );
          if (element) {
            observer.observe(element);
          }
        }
      };
    };
  }, [distance, origin, threshold, once]);

  return { isVisible, ref: elementRef };
}