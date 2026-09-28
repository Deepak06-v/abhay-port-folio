/*!
  Motion primitives.

  One place for easing, timing, and reduced-motion so animation decisions
  stay consistent across the site.
*/

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Matches the --ease-* tokens in variables.css. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power2.inOut',
  soft: 'power3.out',
};

export const DURATION = {
  fast: 0.24,
  base: 0.45,
  slow: 0.7,
  reveal: 0.72,
};

const query = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

/**
 * Run `fn` only when motion is allowed. When it is not, run `fallback`
 * (or nothing) so the UI lands in its final, readable state immediately.
 */
export function whenMotionAllowed(fn, fallback) {
  if (prefersReducedMotion()) {
    fallback?.();
    return () => {};
  }
  return fn();
}

/**
 * ScrollTrigger start position that reveals an element slightly before it
 * reaches the fold, and a bottom margin so short sections still trigger.
 */
export const REVEAL_START = 'top 88%';
export const REVEAL_END = 'bottom 12%';

export { gsap, ScrollTrigger };
