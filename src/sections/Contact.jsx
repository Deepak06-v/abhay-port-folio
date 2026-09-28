/*!
  Contact — closing statement plus whatever real channels exist.

  All values in data/contact.js are currently empty, so every channel is
  filtered out rather than rendered as a dead link. When none survive, the
  section shows an explicit note instead of pretending to be clickable.
*/

import { useReveal } from '../hooks/useReveal';
import contact from '../data/contact';
import { scrollToSection } from '../lib/scroll';
import './contact.css';

/** Only keep channels that actually have a value to link to. */
function buildChannels(data) {
  const channels = [];

  if (data.email) {
    channels.push({
      key: 'email',
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
      external: false,
    });
  }

  if (data.linkedin) {
    channels.push({
      key: 'linkedin',
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`,
      external: true,
    });
  }

  if (data.phone) {
    channels.push({
      key: 'phone',
      label: 'Phone',
      value: data.phone,
      href: `tel:${data.phone.replace(/\s+/g, '')}`,
      external: false,
    });
  }

  return channels;
}

export default function Contact() {
  const scopeRef = useReveal();
  const channels = buildChannels(contact);
  const hasChannels = channels.length > 0;

  return (
    <section
      className="section contact"
      id="contact"
      ref={scopeRef}
      aria-labelledby="contact-title"
    >
      <div className="container">
        <div className="contact__inner">
          <p className="tech-label contact__label" data-reveal="up">
            <span className="tech-label__index">06</span>
            Contact
          </p>

          <h2 className="contact__title" id="contact-title" data-reveal="up">
            Let&rsquo;s build something worth shipping.
          </h2>

          <p className="lede contact__lede" data-reveal="up">
            I&rsquo;m open to internships, entry-level roles, and collaborative builds.
            If something here is relevant to you, I&rsquo;d like to hear about it.
          </p>

          {hasChannels ? (
            <ul className="contact__channels" role="list">
              {channels.map((channel) => (
                <li key={channel.key} data-reveal="up">
                  <a
                    className="contact__channel"
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noreferrer noopener' }
                      : {})}
                  >
                    <span className="contact__channel-label mono">{channel.label}</span>
                    <span className="contact__channel-value">{channel.value}</span>
                    <svg
                      className="contact__channel-arrow"
                      width="16"
                      height="16"
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
                </li>
              ))}
            </ul>
          ) : (
            /*
              Honest empty state. The real values belong in src/data/contact.js
              — this branch disappears the moment any of them is filled in.
            */
            <p className="contact__placeholder" data-reveal="up">
              <span className="contact__placeholder-label mono">Direct channels</span>
              Contact details have not been published here yet. Add them in
              <code className="contact__code">src/data/contact.js</code> and they will
              appear here automatically.
            </p>
          )}

          <button
            className="contact__back link-arrow"
            type="button"
            onClick={() => scrollToSection('home')}
            data-reveal="up"
          >
            Back to top
            <svg
              className="link-arrow__icon"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 12V2M3 6l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
