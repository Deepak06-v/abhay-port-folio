/*!
  Contact Section - Phase 10
  Premium editorial CTA + contact section
*/

import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import contactData from '../data/contact';
import './contact.css';

function Contact() {
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

  const { isVisible: contactVisible } = useScrollReveal({
    distance: '0px',
    origin: 'top',
    threshold: 0.2,
    once: true,
  });

  useEffect(() => {
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
      contactInfo.style.animationPlayState = reducedMotion ? 'paused' : contactVisible ? 'running' : 'paused';
    }
  }, [reducedMotion, contactVisible]);

  const hasContactInfo = contactData.email || contactData.phone || contactData.linkedin;

  return (
    <section
      id="contact"
      className="contact"
      aria-labelledby="contact-heading"
      role="region"
    >
      <div className="contact-container">
        <div className="contact-content">
          <span className="contact-label">GET IN TOUCH</span>
          <h2 id="contact-heading" className="contact-heading">
            LET'S BUILD SOMETHING.
          </h2>
          <p className="contact-desc">
            Have an opportunity, project, or idea worth exploring? Let's connect.
          </p>
        </div>

        {hasContactInfo && (
          <div className="contact-info">
            {contactData.email && (
              <a
                href={`mailto:${contactData.email}`}
                className="contact-item"
                aria-label={`Email Abhay Kumar`}
              >
                <span className="contact-item-label">EMAIL</span>
                <span className="contact-item-value">{contactData.email}</span>
                <svg
                  className="contact-item-arrow"
                  viewBox="0 0 24 24"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path d="M7 10l5 5 5-5-1.4-1.4L14 10.6z" />
                </svg>
              </a>
            )}

            {contactData.phone && (
              <a
                href={`tel:${contactData.phone}`}
                className="contact-item"
                aria-label={`Phone Abhay Kumar`}
              >
                <span className="contact-item-label">PHONE</span>
                <span className="contact-item-value">{contactData.phone}</span>
                <svg
                  className="contact-item-arrow"
                  viewBox="0 0 24 24"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path d="M7 10l5 5 5-5-1.4-1.4L14 10.6z" />
                </svg>
              </a>
            )}

            {contactData.linkedin && (
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
                aria-label="LinkedIn profile"
              >
                <span className="contact-item-label">LINKEDIN</span>
                <span className="contact-item-value">
                  {contactData.linkedin.replace('https://linkedin.com/in/', '')}
                </span>
                <svg
                  className="contact-item-arrow"
                  viewBox="0 0 24 24"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path d="M7 10l5 5 5-5-1.4-1.4L14 10.6z" />
                </svg>
              </a>
            )}
          </div>
        )}

        {hasContactInfo && (
          <div className="contact-cta">
            <a href="#contact" className="cta-button" data-magnetic>
              GET IN TOUCH
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default Contact;