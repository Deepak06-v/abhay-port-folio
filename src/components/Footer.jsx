/*!
  Footer — oversized wordmark, quiet metadata.

  Social links with no URL are dropped rather than rendered inert.
*/

import footer from '../data/footer';
import { scrollToSection } from '../lib/scroll';
import './footer.css';

export default function Footer() {
  // Drop channels that have no real URL behind them.
  const social = footer.social.filter((item) => Boolean(item.url));

  return (
    <footer className="footer" id="colophon">
      <div className="container">
        <div className="footer__top">
          <div className="footer__identity">
            <p className="footer__name">{footer.primaryIdentity}</p>
            <p className="footer__role mono">{footer.secondaryIdentity}</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <ul className="footer__nav-list" role="list">
              {footer.navigation.map((item) => (
                <li key={item.id}>
                  <a
                    className="footer__nav-link"
                    href={item.hash}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Oversized wordmark; clipped by the footer's bottom edge. */}
        <p className="footer__wordmark" aria-hidden="true">
          {footer.primaryIdentity}
        </p>

        <div className="footer__bottom">
          <p className="footer__copyright mono">{footer.copyright}</p>

          {social.length > 0 && (
            <ul className="footer__social" role="list">
              {social.map((item) => (
                <li key={item.key}>
                  <a
                    className="footer__social-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
