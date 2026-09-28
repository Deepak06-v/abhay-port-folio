/*!
  Hero — poster composition.

  Layout is deliberately not a centred stack: a full-bleed technical ticker
  runs across the top, the name occupies a wide asymmetric column, a bordered
  profile panel holds the factual metadata on the right, and a numbered stack
  strip anchors the bottom. Each band is separated by a 2px rule so the hero
  reads as a printed sheet rather than a soft hero block.

  Entrance order: ambient field -> ticker -> name lines -> role -> accent rule
  -> lede -> actions -> panel -> stack strip. The name rises out of a clip
  mask; nothing animates a layout property.
*/

import { useEffect, useRef, useState } from 'react';
import { gsap, EASE, DURATION, prefersReducedMotion } from '../lib/motion';
import { scrollToSection } from '../lib/scroll';
import { PROFILE, HERO_PHRASES } from '../data/profile';
import skills from '../data/skills';
import { useMagnetic } from '../hooks/useMagnetic';
import './hero.css';

const ROTATE_MS = 3800;

/* Derived from the authoritative skills data so the strip can never drift from
   the Stack section. Only the MERN core is listed — the lede calls it the MERN
   stack, and the full inventory lives in Skills. */
const STACK = [
  skills.frontEnd.technologies.find((t) => t === 'React'),
  ...skills.backEnd.technologies,
].filter(Boolean);

const PROFILE_ROWS = [
  { key: 'Role', value: PROFILE.role },
  { key: 'Base', value: PROFILE.location },
  { key: 'Study', value: PROFILE.education },
];

export default function Hero() {
  const rootRef = useRef(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const magneticRef = useMagnetic({ strength: 0.2, max: 8 });

  /* --- Entrance sequence ------------------------------------------- */

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll('[data-enter]'), { opacity: 1, y: 0, scale: 1 });
      gsap.set(root.querySelectorAll('[data-enter-line] > span'), { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.out, duration: DURATION.base },
      });

      // 1. Ambient field: opacity + scale only.
      tl.from('[data-enter="ambient"]', {
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
      })
        // 2. Technical ticker slides down from above the fold.
        .from('[data-enter="ticker"]', { opacity: 0, y: -16, duration: 0.5 }, '-=0.72')
        // 3. The name, line by line, rising out of a mask.
        .from(
          '[data-enter-line] > span',
          { yPercent: 108, duration: 0.95, stagger: 0.08 },
          '-=0.34'
        )
        // 4. Rotating role line.
        .from('[data-enter="role"]', { opacity: 0, x: -14, duration: 0.5 }, '-=0.55')
        // 5. Accent rule draws in from the left.
        .from('[data-enter="rule"]', { scaleX: 0, transformOrigin: 'left', duration: 0.6 }, '-=0.4')
        // 6. Supporting copy and actions.
        .from('[data-enter="lede"]', { opacity: 0, y: 16, duration: 0.5 }, '-=0.42')
        .from('[data-enter="cta"]', { opacity: 0, y: 16, duration: 0.45, stagger: 0.12 }, '-=0.36')
        // 7. Profile panel and the bottom stack strip.
        .from('[data-enter="panel"]', { opacity: 0, x: 20, duration: 0.6 }, '-=0.6')
        .from('[data-enter="stack"]', { opacity: 0, y: 18, duration: 0.55 }, '-=0.45');

      // 8. Subtle scroll parallax on the ambient layers only.
      gsap.to('[data-drift="far"]', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });

      gsap.to('[data-drift="near"]', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* --- Rotating role line ------------------------------------------- */

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(
      () => setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, []);

  // Keyed remount gives each phrase a clean state; the role line is a fixed
  // width so swapping the text cannot reflow the layout.
  return (
    <section className="hero" id="home" ref={rootRef} aria-labelledby="hero-title">
      <div className="hero__bg" data-enter="ambient" aria-hidden="true">
        <div className="tech-grid" data-drift="far" />
        <div className="hero__block" data-drift="near" />
      </div>

      {/* Top technical ticker — a full-bleed band, not a floating badge. */}
      <div className="hero__ticker" data-enter="ticker">
        <div className="hero__ticker-inner container">
          <span className="tech-label">
            <span className="tech-label__index">01</span>
            Status
          </span>
          <span className="hero__ticker-sep" aria-hidden="true" />
          <span className="pill">
            <span className="pill__dot" aria-hidden="true" />
            {PROFILE.availability}
          </span>
          <span className="hero__ticker-sep" aria-hidden="true" />
          <span className="mono">{PROFILE.location}</span>
          <span className="hero__ticker-sep" aria-hidden="true" />
          <span className="mono">{PROFILE.education}</span>
        </div>
      </div>

      <div className="hero__inner container">
        <div className="hero__main">
          {/*
            data-mask is deliberately NOT used here: that system is driven by
            useReveal, and the hero owns its lines via GSAP instead. Overlapping
            the two parked the name at translateY(108%). Each line's own
            overflow:hidden supplies the mask.
          */}
          <h1 className="hero__title" id="hero-title">
            <span className="hero__line" data-enter-line="true">
              <span>Abhay</span>
            </span>
            <span className="hero__line hero__line--stroke" data-enter-line="true">
              <span>Kumar</span>
            </span>
          </h1>

          <p className="hero__role" data-enter="role">
            <span className="hero__role-key mono">Role</span>
            <span className="hero__role-value" key={phraseIndex}>
              {HERO_PHRASES[phraseIndex]}
            </span>
          </p>

          <span className="rule rule--accent hero__rule" data-enter="rule" aria-hidden="true" />

          <p className="lede hero__lede" data-enter="lede">
            BCA 3rd-year student in Bengaluru building real products across the MERN
            stack. I use AI to move faster on the parts that aren&rsquo;t the
            interesting part, and keep every engineering decision my own.
          </p>

          <div className="hero__actions">
            <a
              className="btn btn--primary hero__cta"
              href="#work"
              ref={magneticRef}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('work');
              }}
              data-enter="cta"
            >
              <span className="btn__label">View selected work</span>
              <svg
                className="btn__arrow"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              className="btn btn--ghost"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              data-enter="cta"
            >
              <span className="btn__label">Get in touch</span>
            </a>
          </div>
        </div>

        {/* Bordered profile panel — the factual metadata, presented as a spec block. */}
        <aside className="hero__panel" data-enter="panel" aria-label="Profile summary">
          <div className="hero__panel-head">
            <span className="mono">Profile</span>
            <span className="mono">001</span>
          </div>

          <dl className="hero__panel-list">
            {PROFILE_ROWS.map((row) => (
              <div className="hero__panel-row" key={row.key}>
                <dt className="mono">{row.key}</dt>
                <dd className="hero__panel-value">{row.value}</dd>
              </div>
            ))}
            <div className="hero__panel-row">
              <dt className="mono">Focus</dt>
              <dd className="hero__panel-value">Full-stack web development</dd>
            </div>
          </dl>

          <p className="hero__panel-note">{PROFILE.statement}</p>
        </aside>
      </div>

      {/* Bottom strip: numbered stack inventory. */}
      <div className="hero__stack" data-enter="stack">
        <div className="hero__stack-inner container">
          <span className="tech-label hero__stack-label">
            <span className="tech-label__index">02</span>
            Stack
          </span>
          <ul className="hero__stack-list" aria-label="Core stack">
            {STACK.map((tech, i) => (
              <li className="hero__stack-item" key={tech}>
                <span className="hero__stack-index mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        className="hero__cue"
        type="button"
        onClick={() => scrollToSection('about')}
      >
        <span className="hero__cue-label mono">Scroll</span>
        <span className="hero__cue-track" aria-hidden="true">
          <span className="hero__cue-dot" />
        </span>
      </button>
    </section>
  );
}
