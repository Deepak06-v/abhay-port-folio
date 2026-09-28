/*!
  Custom cursor — ONE pointer coordinate, ONE controller.

  The original build positioned the dot and the ring as independent
  elements, each translating itself from the same event. Any lag or easing
  mismatch between the two made them drift apart.

  Here there is a single root element carrying the pointer position, and the
  ring + dot are children centred on that root's origin. They are aligned by
  construction, not by arithmetic: the root is the only thing that moves, so
  drift is structurally impossible.

  Division of labour:
    root  -> position, written once per pointermove
    ring  -> scale / colour, CSS-transitioned
    dot   -> scale / colour, CSS-transitioned

  No RAF loop and no second animation engine: the browser's own compositor
  handles the movement, and CSS handles the state changes.
*/

import { useEffect } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import './cursor.css';

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])';
const TEXTUAL = 'p, h1, h2, h3, h4, li, dd, .prose, .lede, .journey__desc';

export default function CustomCursor() {
  useEffect(() => {
    // Touch devices have no hover and no meaningful pointer position.
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (prefersReducedMotion()) return;

    const root = document.createElement('div');
    root.className = 'cursor-root';
    root.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('span');
    ring.className = 'cursor-ring';

    const dot = document.createElement('span');
    dot.className = 'cursor-dot';

    // Nesting the dot inside the ring is the guarantee: they share one origin.
    ring.append(dot);
    root.append(ring);
    document.body.append(root);

    const html = document.documentElement;
    html.classList.add('has-cursor');

    /* The single coordinate state. Everything else derives from it. */
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const apply = () => {
      root.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    };

    const onMove = (event) => {
      // clientX/clientY only — never pageX/Y mixed with scroll offsets.
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      apply();
      html.classList.add('cursor-visible');
    };

    const setMode = (mode) => {
      if (ring.dataset.mode === mode) return;
      ring.dataset.mode = mode;
    };

    const onOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(INTERACTIVE)) setMode('link');
      else if (target.closest(TEXTUAL)) setMode('text');
      else setMode('');
    };

    const onLeave = () => html.classList.remove('cursor-visible');
    const onEnter = () => html.classList.add('cursor-visible');
    const onDown = () => html.classList.add('cursor-down');
    const onUp = () => html.classList.remove('cursor-down');

    apply();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      root.remove();
      html.classList.remove('has-cursor', 'cursor-visible', 'cursor-down');
    };
  }, []);

  return null;
}
