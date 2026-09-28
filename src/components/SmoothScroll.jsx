/*!
  SmoothScroll — mounts the scroll engine for the lifetime of the app.

  Kept as a component so React owns the lifecycle, while the instance and
  the scroll helpers live in lib/scroll.js so non-React code (the cursor,
  anchor handlers) can reach them.
*/

import { useEffect } from 'react';
import {
  initSmoothScroll,
  destroySmoothScroll,
  refreshScroll,
  setScrollOffset,
} from '../lib/scroll';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Match the header's real height rather than hardcoding it.
    const header = document.querySelector('.nav');
    const syncOffset = () =>
      setScrollOffset(header ? header.offsetHeight + 12 : 88);

    syncOffset();
    const lenis = initSmoothScroll();

    // Layout can shift after fonts and images land; keep triggers honest.
    const refresh = () => refreshScroll();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    // Respect the OS setting if it changes mid-session.
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => lenis?.resize();

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      motionQuery.removeEventListener('change', onMotionChange);
      destroySmoothScroll();
    };
  }, []);

  return children;
}
