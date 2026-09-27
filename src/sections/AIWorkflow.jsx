/*!
  AI Workflow Section - Phase 8
  How Abhay uses AI in his development workflow
*/

import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import workflowData from '../data/workflow';
import './aiworkflow.css';

function AIWorkflow() {
  const [activeStage, setActiveStage] = useState(1);
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

  const { isVisible: processVisible } = useScrollReveal({
    distance: '0px',
    origin: 'top',
    threshold: 0.2,
    once: true,
  });

  useEffect(() => {
    const processEl = document.querySelector('.aiworkflow-process');
    if (processEl) {
      processEl.style.animationPlayState = reducedMotion ? 'paused' : processVisible ? 'running' : 'paused';
    }
  }, [reducedMotion, processVisible]);

  const handleStageFocus = (stageNumber) => {
    setActiveStage(stageNumber);
  };

  return (
    <section
      id="ai-workflow"
      className="ai-workflow"
      aria-labelledby="ai-workflow-heading"
      role="region"
    >
      <div className="aiworkflow-container">
        <div className="aiworkflow-header">
          <span className="aiworkflow-label">AI + DEVELOPMENT</span>
          <h2 id="ai-workflow-heading" className="aiworkflow-heading">
            HOW I BUILD
          </h2>
          <p className="aiworkflow-description">
            I use AI to accelerate the development process — from planning and
            exploration to implementation, debugging, and iteration — while keeping
            the engineering decisions and final product under my control.
          </p>
        </div>

        <div className="aiworkflow-process">
          {workflowData.map((stage) => {
            const isActive = stage.number === activeStage.toString();
            const isBefore = Number(stage.number) < Number(activeStage);
            const isAfter = Number(stage.number) > Number(activeStage);

            return (
              <div
                key={stage.id}
                className="aiworkflow-stage"
                role="button"
                tabIndex={0}
                onFocus={() => handleStageFocus(Number(stage.number))}
                onBlur={() => {
                  // Reset to first stage on blur if desired, or keep current
                }}
                onMouseEnter={() => {
                  if (!reducedMotion) {
                    setActiveStage(Number(stage.number));
                  }
                }}
              >
                <div
                  className="aiworkflow-stage-number"
                  aria-hidden="true"
                >
                  {stage.number}
                </div>

                <h3
                  className="aiworkflow-stage-title"
                  aria-label={stage.title}
                >
                  {stage.title}
                </h3>
                <p
                  className="aiworkflow-stage-description"
                  aria-label={stage.description}
                >
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AIWorkflow;