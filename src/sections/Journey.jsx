/*!
  Journey Section - Phase 9
  Educational and development timeline
*/

import React, { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import journeyData from '../data/journey';
import './journey.css';

function Journey() {
  const [activeStage, setActiveStage] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const timelineRef = useRef(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const handleStageFocus = (stageNumber) => {
    setActiveStage(stageNumber);
  };

  const { isVisible: timelineVisible } = useScrollReveal({
    distance: '0px',
    origin: 'top',
    threshold: 0.2,
    once: true,
  });

  useEffect(() => {
    const timelineEl = timelineRef.current;
    if (timelineEl) {
      timelineEl.style.animationPlayState = reducedMotion ? 'paused' : timelineVisible ? 'running' : 'paused';
    }
  }, [reducedMotion, timelineVisible, timelineRef]);

  return (
    <section
      id="journey"
      className="journey"
      aria-labelledby="journey-heading"
      role="region"
      ref={timelineRef}
    >
      <div className="journey-container">
        <div className="journey-header">
          <span className="journey-label">MY JOURNEY</span>
          <h2 id="journey-heading" className="journey-heading">
            BUILDING AS I LEARN
          </h2>
          <p className="journey-description">
            A journey from learning the fundamentals of web development to building
            complete, practical digital products with modern development tools and
            AI-assisted workflows.
          </p>
        </div>

        <div className="journey-timeline">
          {journeyData.map((stage) => {
            const isActive = stage.number === activeStage.toString();
            const isBefore = Number(stage.number) < Number(activeStage);
            const isAfter = Number(stage.number) > Number(activeStage);

            return (
              <div
                key={stage.id}
                className="journey-stage"
                role="button"
                tabIndex={0}
                onFocus={() => handleStageFocus(Number(stage.number))}
                onMouseEnter={() => {
                  if (!reducedMotion) {
                    setActiveStage(Number(stage.number));
                  }
                }}
              >
                <div
                  className="journey-stage-indicator"
                  aria-hidden="true"
                >
                  {stage.number}
                </div>

                <div className="journey-stage-content">
                  <h3 className="journey-stage-title" aria-label={stage.title}>
                    {stage.title}
                  </h3>
                  <p className="journey-stage-description" aria-label={stage.description}>
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Journey;