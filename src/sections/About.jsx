/*!
  About Section - Phase 5
  Premium editorial about page
*/

import { useRef, useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './about.css';

function About() {
  const headingRef = useRef(null);
  const positionRefs = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const { isVisible: headingVisible, ref: headingRefUpdater } = useScrollReveal({
    distance: '0px',
    origin: 'top',
    threshold: 0.2,
    once: true,
  });

  const { isVisible: positionVisible, ref: positionRefUpdater } = useScrollReveal({
    distance: '0px',
    origin: 'top',
    threshold: 0.2,
    once: true,
  });

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.style.animationPlayState = reducedMotion ? 'paused' : 'running';
      headingRefUpdater.current = headingRef.current;
    }
  }, [reducedMotion, headingRef, headingRefUpdater]);

  useEffect(() => {
    if (positionRefs.current) {
      positionRefs.current.forEach((el) => {
        el.style.animationPlayState = reducedMotion ? 'paused' : isVisible ? 'running' : 'paused';
        positionRefUpdater.current = el;
      });
    }
  }, [reducedMotion, isVisible, positionRefs, positionRefUpdater]);

  return (
    <section
      id="about"
      className="about"
      aria-labelledby="about-heading"
    >
      <div className="about-container">
        <div className="about-content">
          <span className="about-label">ABOUT ME</span>
          <h2 id="about-heading" className="about-heading">
            I’m Abhay Kumar, a BCA 3rd-year student focused on modern web
            development and AI-assisted development.
          </h2>
          <p className="about-desc">
            I build websites by combining frontend and backend development
            with AI-powered tools to speed up planning, development, debugging,
            and iteration.
          </p>
          <p className="about-goal">
            My goal is to understand the code and build useful, polished
            products rather than simply generate code.
          </p>
        </div>

        <div className="about-positioning">
          <div
            className="about-position"
            role="listitem"
          >
            <span className="about-position-number">01</span>
            <span className="about-position-label">BCA — 3RD YEAR</span>
          </div>

          <div
            className="about-position"
            role="listitem"
          >
            <span className="about-position-number">02</span>
            <span className="about-position-label">WEB DEVELOPMENT</span>
          </div>

          <div
            className="about-position"
            role="listitem"
          >
            <span className="about-position-number">03</span>
            <span className="about-position-label">AI-ASSISTED WORKFLOW</span>
          </div>

          <div
            className="about-position"
            role="listitem"
          >
            <span className="about-position-number">04</span>
            <span className="about-position-label">REAL PROJECT BUILDING</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;