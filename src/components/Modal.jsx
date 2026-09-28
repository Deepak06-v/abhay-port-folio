/*!
  Modal — accessible dialog used for project detail.

  Handles the things a hand-rolled overlay usually gets wrong: Escape to
  close, focus moved in on open and restored on close, focus trapped while
  open, background scroll locked, and aria wiring on the trigger.
*/

import { useCallback, useEffect, useRef } from 'react';
import { gsap, EASE, prefersReducedMotion } from '../lib/motion';
import './modal.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, labelledBy, children }) {
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);

  const trapFocus = useCallback((event) => {
    if (event.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;

    const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null
    );
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement;

    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener('keydown', onKeyDown);

    // Focus the panel itself so the whole dialog is announced.
    const focusTarget = panel?.querySelector(FOCUSABLE) ?? panel;
    focusTarget?.focus({ preventScroll: true });

    if (panel && !prefersReducedMotion()) {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 18, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: EASE.out }
      );
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (returnFocusRef.current instanceof HTMLElement) {
        returnFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, [open, onClose, trapFocus]);

  if (!open) return null;

  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        ref={panelRef}
        tabIndex={-1}
      >
        <button className="modal__close" type="button" onClick={onClose}>
          <span className="sr-only">Close</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
