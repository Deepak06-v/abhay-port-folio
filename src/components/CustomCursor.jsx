/*!
  Custom Cursor - Phase 13
  Premium custom cursor with magnetic interactions
*/

import { useEffect, useRef } from 'react';

// Detect if pointer is fine (desktop) or coarse (touch)
const isFinePointer = typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false;

// Detect reduced motion preference
const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : { matches: false };

export function CustomCursor() {
  // Cursor refs
  const innerRef = useRef(null);
  const outerRef = useRef(null);

  // Mouse position tracking
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Cursor position state (using refs to avoid React re-renders)
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  // Animation frame ID
  const animId = useRef(0);

  // Magnetic state
  const magneticRef = useRef(null); // Currently focused magnetic element
  const magneticOriginalPos = useRef({ x: 0, y: 0 }); // Original position (left/top)

  // Initialize DOM elements
  useEffect(() => {
    if (isFinePointer && !reducedMotion.matches) {
      // Create inner dot
      const inner = document.createElement('div');
      inner.className = 'cursor-inner';
      inner.setAttribute('role', 'status');
      inner.setAttribute('aria-label', 'Custom cursor inner dot');
      innerRef.current = inner;
      document.body.appendChild(inner);

      // Create outer ring
      const outer = document.createElement('div');
      outer.className = 'cursor-outer';
      outer.setAttribute('role', 'status');
      outer.setAttribute('aria-label', 'Custom cursor outer ring');
      outerRef.current = outer;
      document.body.appendChild(outer);

      // Mouse move handler
      const handleMouseMove = (e) => {
        mouseX.current = e.clientX;
        mouseY.current = e.clientY;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Check if element is interactive (links, buttons, or[data-magnetic])
      const isInteractiveElement = (el) => {
        return (
          el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.hasAttribute('data-magnetic') ||
          el.classList.contains('nav-link') ||
          el.classList.contains('footer-nav-link') ||
          el.classList.contains('project-github') ||
          el.classList.contains('project-live') ||
          el.classList.contains('cta-button')
        );
      };

      // Magnetic effect logic
      const magneticElements = new Map();

      const enableMagnetic = (el) => {
        if (magneticElements.has(el)) return;
        
        const rect = el.getBoundingClientRect();
        magneticOriginalPos.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        magneticElements.set(el, {
          el,
          originalX: magneticOriginalPos.current.x,
          originalY: magneticOriginalPos.current.y,
        });

        // Apply mouseenter/leave to the element
        el.addEventListener('mouseenter', () => {
          magneticRef.current = el;
        });

        el.addEventListener('mouseleave', () => {
          magneticRef.current = null;
          // Reset position with animation
          if (magneticOriginalPos.current) {
            el.style.transition = 'transform 0.3s ease';
            el.style.transform = `translate(${magneticOriginalPos.current.x - rect.width / 2}px, ${magneticOriginalPos.current.y - rect.height / 2}px)`;
            // Wait for animation then remove transition
            setTimeout(() => {
              el.style.transition = '';
            }, 300);
          }
        });
      };

      // Initialize magnetic elements
      const magneticEls = document.querySelectorAll('[data-magnetic]');
      magneticEls.forEach(enableMagnetic);

      // Animation loop
      function animate() {
        // Smoothly move inner dot toward pointer
        cursorX.current += (mouseX.current - cursorX.current) * 0.2;
        cursorY.current += (mouseY.current - cursorY.current) * 0.2;
        innerRef.current.style.transform = `translate(${cursorX.current}px, ${cursorY.current}px)`;

        // Outer ring with more lag
        const outerX = cursorX.current + (mouseX.current - cursorX.current) * 0.1;
        const outerY = cursorY.current + (mouseY.current - cursorY.current) * 0.1;
        outerRef.current.style.transform = `translate(${outerX}px, ${outerY}px)`;

        // Magnetic effect: pull focused element toward pointer
        if (magneticRef.current) {
          const el = magneticRef.current;
          const rect = el.getBoundingClientRect();
          const elementCenterX = rect.left + rect.width / 2;
          const elementCenterY = rect.top + rect.height / 2;

          // Calculate direction and distance from mouse to element center
          const deltaX = mouseX.current - elementCenterX;
          const deltaY = mouseY.current - elementCenterY;

          // Cap the magnetic strength: max 12px movement
          const strength = 0.15; // Lower = more subtle
          const cappedX = Math.max(-12, Math.min(12, deltaX * strength));
          const cappedY = Math.max(-12, Math.min(12, deltaY * strength));

          // Apply transform to move element
          el.style.transform = `translate(${cappedX}px, ${cappedY}px)`;
        } else {
          // No magnetic element focused - reset any magnetic elements
          magneticElements.forEach(({ el }) => {
            el.style.transform = '';
          });
        }

        animId.current = requestAnimationFrame(animate);
      }

      animId.current = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        window.cancelAnimationFrame(animId.current);
        window.removeEventListener('mousemove', handleMouseMove);
        
        // Remove magnetic event listeners
        if (magneticEls) {
          magneticEls.forEach((el) => {
            el.removeEventListener('mouseenter', () => {
              magneticRef.current = el;
            });
            el.removeEventListener('mouseleave', () => {
              magneticRef.current = null;
            });
          });
        }
        
        magneticElements.forEach(({ el }) => {
          el.style.transform = '';
          el.style.transition = '';
        });
        magneticElements.clear();
      };
    } else {
      // Hide custom cursor on touch or reduced motion
      if (innerRef.current) innerRef.current.style.display = 'none';
      if (outerRef.current) outerRef.current.style.display = 'none';
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animId.current) {
        window.cancelAnimationFrame(animId.current);
      }
      if (innerRef.current) {
        innerRef.current.remove();
      }
      if (outerRef.current) {
        outerRef.current.remove();
      }
    };
  }, []);

  return null;
};

export default CustomCursor;