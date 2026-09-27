/*!
  Hero Section - Phase 4
  Premium hero with dynamic text and subtle interactive background
*/

import { useRef, useEffect, useState } from 'react';
import './hero.css';

function Hero() {
  const [currentPhrase, setCurrentPhrase] = useState('AI-ASSISTED WEB DEVELOPER');
  const phrases = ['AI-ASSISTED WEB DEVELOPER', 'MERN DEVELOPER', 'MODERN WEB BUILDER'];
  const phraseRef = useRef(null);

  // Cycle through phrases every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => {
        const idx = phrases.indexOf(prev);
        return phrases[(idx + 1) % phrases.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const isReduced = prefersReducedMotion.matches;

  if (isReduced) {
    return (
      <section
        id="home"
        className="hero"
        aria-labelledby="hero-heading"
        aria-relevant="all"
      >
        <div className="hero-inner">
          <div className="hero-content">
            <p className="hero-eyebrow">BASED IN BENGALURU • BUILDING WITH AI + CODE</p>
            <h1 id="hero-heading" className="hero-heading">
              {currentPhrase}
            </h1>
            <p className="hero-desc">
              BCA 3rd-year student focused on building modern web experiences
              with code and AI-assisted development.
            </p>
            <div className="hero-cta">
              <a href="#work" className="btn btn-primary" data-magnetic>
                EXPLORE MY WORK
              </a>
              <a href="#contact" className="btn btn-secondary" data-magnetic>
                LET'S CONNECT
              </a>
            </div>
          </div>
          <div className="hero-background" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="hero"
      aria-labelledby="hero-heading"
      aria-relevant="all"
    >
      <div className="hero-inner">
        <div className="hero-content">
          <p className="hero-eyebrow">BASED IN BENGALURU • BUILDING WITH AI + CODE</p>
          <h1 id="hero-heading" className="hero-heading">
            {currentPhrase}
          </h1>
          <p className="hero-desc">
            BCA 3rd-year student focused on building modern web experiences
            with code and AI-assisted development.
          </p>
          <div className="hero-cta">
            <a href="#work" className="btn btn-primary">
              EXPLORE MY WORK
            </a>
            <a href="#contact" className="btn btn-secondary">
              LET'S CONNECT
            </a>
          </div>
        </div>
        <div className="hero-background" aria-hidden="true" />
      </div>
    </section>
  );
}

export default Hero;