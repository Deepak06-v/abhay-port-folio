/*!
  useMagnetic — subtle pull toward the pointer, with a clean release.

  Strength is deliberately low (0.25) and clamped so the element never
  leaves its own hit box. Only applied to a couple of focal elements at a
  time; applying it everywhere reads as noise.
*/

import { useEffect, useRef } from 'react';
import { gsap, EASE, DURATION, prefersReducedMotion } from '../lib/motion';

export function useMagnetic({ strength = 0.25, max = 10 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const xTo = gsap.quickTo(el, 'x', { duration: DURATION.base, ease: EASE.out });
    const yTo = gsap.quickTo(el, 'y', { duration: DURATION.base, ease: EASE.out });

    const clamp = (v) => Math.max(-max, Math.min(max, v));

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      xTo(clamp((event.clientX - (rect.left + rect.width / 2)) * strength));
      yTo(clamp((event.clientY - (rect.top + rect.height / 2)) * strength));
    };

    const onEnter = () => el.classList.add('is-magnetic');

    const onLeave = () => {
      el.classList.remove('is-magnetic');
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, max]);

  return ref;
}

export default useMagnetic;
