/*!
  SmoothScroll - Lenis + GSAP Integration
  Phase 12: Centralized smooth scrolling and motion system
*/

import React, { useEffect } from 'react';

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/**
 * Initialize Lenis once at the application level.
 * Returns the Lenis instance for potential external use.
 */
export function useLenis() {
  useEffect(() => {
    // Import Lenis dynamically to avoid SSR issues
    let mounted = true;

    import('lenis').then(({ default: Lenis }) => {
      // Clean up any existing instance
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => t,
        direction: 'vertical',
        gestureOrientation: 'vertical',
        smooth: true,
      });

      // Animation loop - connect with RAF
      function raf(time) {
        if (lenis) {
          lenis.raf(time);
        }
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Cleanup on unmount
      return () => {
        mounted = false;
        if (lenis) {
          lenis.destroy();
          lenis = null;
        }
      };
    }).catch((err) => {
      console.error('Failed to initialize Lenis:', err);
    });
  }, []);

  return { lenis };
}

/**
 * Global Lenis synchronization with GSAP ScrollTrigger.
 * Must be called once at the app level.
 */
export function useLenisScrollTrigger() {
  useEffect(() => {
    if (!lenis) return;

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', (args) => {
      // Update ScrollTrigger if needed
      ScrollTrigger.update();
    });

    // Sync on resize/orientationchange
    const handleResize = () => {
      ScrollTrigger.update();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

/**
 * Stop Lenis smooth scrolling when reduced motion is preferred.
 * Call this in a useEffect when prefers-reduced-motion changes.
 */
export function useReducedMotionLenis() {
  const [reducedMotion, setReducedMotion] = React.useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // If reduced motion, disable Lenis smooth scrolling
  // by setting the lenis latency to 0 or destroying the instance
  React.useEffect(() => {
    if (reducedMotion && lenis) {
      // dramatically reduce smooth scrolling speed
      lenis.options.duration = 0.01;
      lenis.options.easing = (t) => t;
    } else if (lenis) {
      // restore normal duration
      lenis.options.duration = 1.2;
      lenis.options.easing = (t) => t;
    }
  }, [reducedMotion, lenis]);
}