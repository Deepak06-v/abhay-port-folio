/*!
  Navbar — fixed header, scroll-spy active state, sliding indicator.

  The indicator is one element that GSAP moves between items, so the accent
  block reads as a single continuous object rather than six independently
  toggled backgrounds.

  SECTION_IDS is the page's document order and drives the scroll-spy. LINKS
  is the visible nav, which is a subset — the brand is the route home, so
  there is no "Index" entry to occupy space.
*/

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, EASE, prefersReducedMotion } from '../lib/motion';
import { scrollToSection } from '../lib/scroll';
import './navbar.css';

/* Must match the render order in App.jsx. */
const SECTION_IDS = ['home', 'about', 'work', 'journey', 'skills', 'process', 'contact'];

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Stack' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ activeId, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const lastYRef = useRef(0);

  /* --- Sliding indicator ------------------------------------------- */

  const moveIndicator = useCallback(
    (id, immediate = false) => {
      const indicator = indicatorRef.current;
      const list = listRef.current;
      if (!indicator || !list) return;

      const item = list.querySelector(`[data-nav-id="${id}"]`);
      if (!item) return;

      const target = {
        x: item.offsetLeft,
        width: item.offsetWidth,
      };

      if (immediate || prefersReducedMotion()) {
        gsap.set(indicator, target);
        return;
      }

      gsap.to(indicator, { ...target, duration: 0.45, ease: EASE.out, overwrite: 'auto' });
    },
    []
  );

  // Position once fonts/layout settle, then whenever the active item changes.
  useEffect(() => {
    // "home" has no nav entry, so there is nothing to mark.
    if (!activeId || activeId === 'home') {
      gsap.set(indicatorRef.current, { autoAlpha: 0 });
      return undefined;
    }
    gsap.set(indicatorRef.current, { autoAlpha: 1 });
    const id = requestAnimationFrame(() => moveIndicator(activeId));
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => moveIndicator(activeId, true));
    }
    return () => cancelAnimationFrame(id);
  }, [activeId, moveIndicator, isOpen]);

  useEffect(() => {
    if (!activeId || activeId === 'home') return undefined;
    const onResize = () => moveIndicator(activeId, true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeId, moveIndicator]);

  /* --- Condense + hide on scroll down ------------------------------ */

  useEffect(() => {
    let frame = 0;

    const evaluate = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled(y > 24);

      // Reveal when scrolling up or near the top; hide when heading down.
      const goingDown = y > lastYRef.current;
      setIsHidden(goingDown && y > 320);
      lastYRef.current = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* --- Mobile drawer ------------------------------------------------ */

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    // Stop the page behind the drawer from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleClick = (event, id) => {
    event.preventDefault();
    setIsOpen(false);
    scrollToSection(id);
    onNavigate?.(id);
  };

  return (
    <header
      className={[
        'nav',
        isScrolled ? 'is-scrolled' : '',
        isHidden ? 'is-hidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="nav__inner container">
        <a
          className="nav__brand"
          href="#home"
          onClick={(e) => handleClick(e, 'home')}
          aria-label="Abhay Kumar — back to top"
        >
          <span className="nav__brand-mark" aria-hidden="true">
            AK
          </span>
          <span className="nav__brand-name">Abhay Kumar</span>
        </a>

        <nav className="nav__desktop" aria-label="Sections">
          {/*
            The indicator lives on the <nav>, not inside the <ul>: the ul
            content model only allows li/script elements. It sits behind the
            list and is a solid accent block, not an underline.
          */}
          <span className="nav__indicator" ref={indicatorRef} aria-hidden="true" />
          <ul className="nav__list" ref={listRef}>
            {LINKS.map((link, i) => {
              const isActive = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    className={`nav__link${isActive ? ' is-active' : ''}`}
                    href={`#${link.id}`}
                    data-nav-id={link.id}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => handleClick(e, link.id)}
                  >
                    <span className="nav__link-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          className="nav__cta"
          href="#contact"
          onClick={(e) => handleClick(e, 'contact')}
        >
          <span className="nav__cta-dot" aria-hidden="true" />
          Available for work
        </a>

        <button
          className="nav__toggle"
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="nav-drawer"
        >
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          <span className={`nav__toggle-bars${isOpen ? ' is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`nav__drawer${isOpen ? ' is-open' : ''}`}
        id="nav-drawer"
        hidden={!isOpen}
      >
        <ul className="nav__drawer-list">
          {LINKS.map((link, i) => (
            <li key={link.id} style={{ '--i': i }}>
              <a
                className={`nav__drawer-link${
                  activeId === link.id ? ' is-active' : ''
                }`}
                href={`#${link.id}`}
                aria-current={activeId === link.id ? 'true' : undefined}
                onClick={(e) => handleClick(e, link.id)}
              >
                <span className="nav__drawer-index mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="nav__drawer-foot mono">Bengaluru · BCA 3rd year</p>
      </div>
    </header>
  );
}

export { LINKS as NAV_LINKS, SECTION_IDS as NAV_SECTION_IDS };
