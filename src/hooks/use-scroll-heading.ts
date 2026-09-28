import { useEffect } from 'react';

import { type HeadingState, nextScrollHeading } from '@/utils/scroll-heading';

// Tells the page which way the reader goes, so the journey's planes face it: scrolling back,
// they fly back rather than reverse, tail first. Set on <html> as data-scroll-heading="up"
// while the reader goes up; absent going down, the way the page reads.
export function useScrollHeading(): void {
  useEffect(() => {
    const root = document.documentElement;
    let state: HeadingState = { heading: 'down', farthest: window.scrollY };

    function handleScroll(): void {
      const next = nextScrollHeading(state, window.scrollY);
      if (next.heading !== state.heading) {
        if (next.heading === 'up') {
          root.setAttribute('data-scroll-heading', 'up');
        } else {
          root.removeAttribute('data-scroll-heading');
        }
      }
      state = next;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      root.removeAttribute('data-scroll-heading');
    };
  }, []);
}
