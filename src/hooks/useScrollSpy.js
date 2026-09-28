/*!
  useScrollSpy — tracks which section the reader is actually looking at.

  A single IntersectionObserver covers a band that starts just below the
  fixed header and runs to the bottom of the viewport. The active section is
  the last one in that band whose top has already crossed the line, which
  behaves correctly for very short sections, very tall sections, and the gap
  below the last one.

  The observer is the only source of truth: clicks scroll with the same
  engine, so the active item can never disagree with the scroll position.

  @returns the active section id, or the first id before first measurement.
*/

import { useEffect, useRef, useState } from 'react';

const DEFAULT_OFFSET = 96;

export function useScrollSpy(sectionIds, { offset = DEFAULT_OFFSET } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);
  // Mirrors activeId so the observer callback can skip redundant updates
  // without making itself a dependency of the effect.
  const activeRef = useRef(activeId);

  useEffect(() => {
    const line = offset + 1;
    let frame = 0;

    /**
     * Sort by real document position rather than trusting the caller's array
     * order, so nav order and reading order can never disagree.
     */
    const inDocumentOrder = (ids) =>
      [...ids]
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((entry) => entry.el)
        .sort((a, b) => a.el.offsetTop - b.el.offsetTop)
        .map((entry) => entry.id);

    /**
     * The section most recently scrolled past the line: among the visible
     * sections whose top has crossed, the one whose top is closest to the
     * line. Falls back to the first visible section before that.
     */
    const pickPast = (orderedIds) => {
      let best = null;
      let bestTop = -Infinity;

      for (const id of orderedIds) {
        const el = document.getElementById(id);
        if (!el || !visible.has(id)) continue;
        const top = el.getBoundingClientRect().top;
        if (top > line) continue;
        if (top > bestTop) {
          bestTop = top;
          best = id;
        }
      }

      return best;
    };

    const visible = new Set();

    const settle = () => {
      frame = 0;

      const ordered = inDocumentOrder(sectionIds);

      let next = pickPast(ordered);

      if (!next) {
        // In a gap between sections: keep something sensible on screen rather
        // than flickering back to the first item.
        next = ordered.find((id) => visible.has(id)) ?? null;
      }

      if (!next) {
        // Nothing observed (e.g. very short viewport) — fall back to geometry.
        for (const id of ordered) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) next = id;
        }
      }

      // At the very bottom, favour the final section even if it is short.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atEnd) {
        next = ordered.length ? ordered[ordered.length - 1] : next;
      }

      if (next && next !== activeRef.current) {
        activeRef.current = next;
        setActiveId(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(settle);
    };

    // Browsers without IntersectionObserver still get a working nav.
    if (typeof IntersectionObserver === 'undefined') {
      const onScroll = () => schedule();
      window.addEventListener('scroll', onScroll, { passive: true });
      schedule();
      return () => {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { id } = entry.target;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        schedule();
      },
      {
        // Band from `offset` down to the bottom edge of the viewport.
        rootMargin: `-${offset}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    const targets = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    targets.forEach((el) => observer.observe(el));

    // Deferred to the next frame: layout has settled, and this keeps the
    // first state update out of the synchronous effect body.
    schedule();

    // Keep in sync when the layout reflows.
    const onResize = () => {
      observer.disconnect();
      visible.clear();
      targets.forEach((el) => observer.observe(el));
      schedule();
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [sectionIds, offset]);

  return activeId;
}

export default useScrollSpy;
