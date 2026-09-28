/*!
  useReveal — declarative scroll reveal.

  Any element carrying [data-reveal] inside the returned ref (or the ref
  target itself) is observed once and flipped to its revealed state when it
  enters the viewport. Staggering is expressed with the --reveal-delay
  custom property, so this hook only has to manage observation.

  Elements are revealed in DOM order within a single observer callback,
  which keeps sibling staggering visually correct.
*/

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';

const SELECTOR = '[data-reveal],[data-mask]';
const REVEALED = 'revealed';
const STEP = 70; // ms between siblings
const MAX_STAGGER = 5; // cap so long lists do not crawl

export function useReveal({ stagger = true, threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) {
  const scopeRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const targets = Array.from(scope.querySelectorAll(SELECTOR));
    if (targets.length === 0) return;

    // No motion, or nothing to do: make everything visible right away.
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.setAttribute('data-reveal-state', REVEALED));
      return;
    }

    // Stagger siblings that sit under the same parent, in DOM order.
    if (stagger) {
      const perParent = new Map();
      for (const el of targets) {
        const key = el.parentElement;
        const index = perParent.get(key) ?? 0;
        perParent.set(key, index + 1);
        if (index > 0) {
          el.style.setProperty('--reveal-delay', `${Math.min(index, MAX_STAGGER) * STEP}ms`);
        }
      }
    }

    const pending = new Set(targets);
    let frame = 0;

    const flush = () => {
      frame = 0;
      for (const el of pending) {
        el.setAttribute('data-reveal-state', REVEALED);
      }
      pending.clear();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          pending.add(entry.target);
          observer.unobserve(entry.target);
        }
        // Batch into one frame so siblings reveal as a group, not a flicker.
        if (pending.size && !frame) {
          frame = requestAnimationFrame(flush);
        }
      },
      { threshold, rootMargin }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [stagger, threshold, rootMargin]);

  return scopeRef;
}

export default useReveal;
