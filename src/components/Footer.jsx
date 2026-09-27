/*!
  Footer Component - Phase 11
  Premium footer completing the portfolio
*/

import React from 'react';
import footerData from '../data/footer';

function Footer() {
  const { primaryIdentity, secondaryIdentity, statement, navigation, social, copyright } = footerData;

  const hasSocialLinks = social.some((item) => item.url);

  return (
    <footer className="footer" aria-label="Footer navigation">
      <div className="footer-container">
        <div className="footer-top">
          <span className="footer-label">{primaryIdentity}</span>
          <p className="footer-secondary">{secondaryIdentity}</p>
          <p className="footer-statement">{statement}</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation links">
          <ul className="footer-nav-links">
            {navigation.map((link) => (
              <li key={link.id} className="footer-nav-item">
                <a href={link.hash} className="footer-nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {hasSocialLinks && (
          <div className="footer-social" aria-label="Social links">
            <ul className="footer-social-links">
              {social.map((item) => {
                if (!item.url) return null;
                const [domain] = item.url.split('/');
                const isExternal = !['localhost', '127.0.0.1'].includes(domain);
                return (
                  <li key={item.key} className="footer-social-link">
                    <a
                      href={item.url}
                      target="_blank"
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={item.label}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="footer-bottom">
          <p className="footer-copyright">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;