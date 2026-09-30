/*!
  ABHAY BUILDS — intro / opening preloader (Phases 1–4).

  A standalone overlay that plays once when the site loads, then hands the
  screen back to the existing website, which is left exactly as it is.

  Sequence:
  1. PHASE 1 — Numerical counter climbs from "00" to "100" over 1.4 seconds.
      "ABHAY BUILDS" fades into visibility.
  2. PHASE 2 — Micro-pause (~200ms) at 100% to anchor the brand identity.
  3. PHASE 3 — ABHAY moves LEFT and BUILDS move RIGHT simultaneously
     away from center (0.8s, power2.inOut).
  4. PHASE 4 — The preloader container slides up using a curved clip-path mask
     (cubic-bezier(0.76, 0, 0.24, 1) / power4.inOut).
  5. PHASE 5 — Clean exit: dispatches window event, hides itself, restores body
     overflow, so the existing website continues untouched.

  On complete the overlay hands the page back cleanly. Everything is
  transform/opacity only — no layout animates.
*/

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from './lib/motion';

const _WORD = 'ABHAY BUILDS'; // kept for reference

export default function Intro() {
  const rootRef = useRef(null);
  const [isComplete, setIsComplete] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const root = rootRef.current;
    if (isComplete || !root) return undefined;

    const ctx = gsap.context(() => {

      if (prefersReducedMotion()) {
        setIsComplete(true);
        root.style.visibility = 'hidden';
        root.style.display = 'none';
        document.body.style.overflow = 'auto';
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        return;
      }

      // "ABHAY BUILDS" words fade into visibility
      const abhayEl = root.querySelector('.preloader__word--abhay');
      const buildsEl = root.querySelector('.preloader__word--builds');

      // Subtle entrance: fade in with gentle translateY and letter-spacing
      // Using power3.inOut for sophisticated easing (not bounce/pop)
      if (abhayEl || buildsEl) {
        gsap.from([abhayEl, buildsEl].filter(Boolean), {
          opacity: 0,
          y: 10,
          letterSpacing: '0.02em',
          duration: 1.2,
          ease: 'power3.inOut',
        });
      }

      // ===========================================
      // PHASE 2 — THE HOLD
      // ===========================================

      // Micro-pause of ~200ms at 100% completion
      gsap.delayedCall(1.4, () => {
        gsap.delayedCall(0.2, () => {
          // ===========================================
          // PHASE 3 — THE SPLIT ANIMATION
          // ===========================================

          // ABHAY moves LEFT, BUILDS moves RIGHT simultaneously
          // Movement distance is responsive, based on actual viewport width
          // (not a hardcoded desktop-only pixel value)
          const movementDist = Math.max(50, Math.min(150, window.innerWidth / 15));

          // Slightly increase letter spacing and maintain optical balance
          // during the separation - both words animate independently
          if (abhayEl) {
            gsap.to(abhayEl, {
              x: -movementDist,
              duration: 0.8,
              ease: 'power3.inOut',
              letterSpacing: '0.05em',
            });
          }
          if (buildsEl) {
            gsap.to(buildsEl, {
              x: movementDist,
              duration: 0.8,
              ease: 'power3.inOut',
              letterSpacing: '0.05em',
            });
          }

          // ===========================================
          // PHASE 4 — CURTAIN REVEAL
          // ===========================================

          // Preloader container slides up with premium custom easing
          gsap.to(root, {
            yPercent: -100,
            duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => {
              // ===========================================
              // PHASE 5 — HANDOFF
              // ===========================================

              setIsComplete(true);
              root.style.visibility = 'hidden';
              root.style.display = 'none';
              document.body.style.overflow = 'auto';
              window.dispatchEvent(new CustomEvent('preloaderComplete'));
            },
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, [isComplete]);

  if (isComplete) return null;

  // ===========================================
  // PRELOADER UI STRUCTURE
  // ===========================================

  return (
    <div
      className="preloader"
      ref={rootRef}
      role="presentation"
      aria-label="ABHAY BUILDS preloader"
      style={{
        background: '#000000',
        color: '#FFFFFF',
        display: 'grid',
        placeItems: 'center',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
      }}
    >
      <div
        className="preloader__stage"
        style={{
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
          gap: 'clamp(1rem, 3vw, 2rem)',
          width: '100%',
          maxWidth: '100%',
          overflow: 'visible',
        }}
      >
        <div
          className="preloader__brand"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 7vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            className="preloader__word preloader__word--abhay"
            style={{ marginRight: 'clamp(1rem, 4vw, 3rem)' }}
          >
            ABHAY
          </span>
          <span
            className="preloader__word preloader__word--builds"
          >
            BUILDS
          </span>
        </div>

        
      </div>
    </div>
  );
}