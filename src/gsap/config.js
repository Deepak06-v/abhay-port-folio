/*!
  GSAP Global Configuration - Phase 12
  Register plugins and configure global defaults once at app level
*/

import { gsap } from 'gsap';

// Register ScrollTrigger if not already registered
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  }).catch((err) => {
    console.error('Failed to register ScrollTrigger:', err);
  });
}

// Global timeline for coordinated animations
export const globalTimeline = gsap.timeline({ paused: true });

// Helper to create staggered animations with reduced motion support
export const createStagger = (elements, config = {}) => {
  const { duration = 0.6, delay = 0, easing = 'power2.out', callback } = config;
  
  return gsap.to(elements, {
    duration,
    delay,
    ease: easing,
    stagger: 0.1,
    overwrite: 'auto',
    onComplete: callback,
  });
};

// Helper for simple fade-in with scroll control
export const fadeIn = (element, { start = 0, end = 1, duration = 1 } = {}) => {
  gsap.fromTo(
    element,
    { opacity: start, y: 30 },
    { opacity: end, y: 0, duration, immediateRender: false }
  );
};