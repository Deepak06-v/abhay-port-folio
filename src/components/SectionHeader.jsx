/*!
  SectionHeader — the repeated section preamble.

  Every section uses the same structure (index / eyebrow / title / optional
  lede) so the page has a consistent rhythm instead of each section
  inventing its own heading layout.
*/

import './section-header.css';

export default function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  titleId,
  aside = null,
}) {
  return (
    <header className="section-header">
      <div className="section-header__meta" data-reveal="up">
        {index && <span className="section-header__index mono">{index}</span>}
        {eyebrow && <span className="eyebrow eyebrow--bare">{eyebrow}</span>}
      </div>

      <div className="section-header__main">
        <h2 className="section-header__title" id={titleId} data-reveal="up">
          {title}
        </h2>
        {lede && (
          <p className="lede section-header__lede" data-reveal="up">
            {lede}
          </p>
        )}
        {aside && <div className="section-header__aside">{aside}</div>}
      </div>
    </header>
  );
}
