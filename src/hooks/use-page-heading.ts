import { type RefObject, useEffect, useRef } from 'react';
import { NavigationType, useLocation, useNavigationType } from 'react-router';

// React Router manages neither focus nor announcements. After a client-side navigation,
// focus moves to the new page's <h1> (tabIndex={-1}) so screen readers announce it and
// keyboard users restart from the top of the content (WCAG 2.4.3, RGAA 12.8).
export function usePageHeading(): RefObject<HTMLHeadingElement | null> {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { key, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // "default" is the key of the entry the app booted on: the browser handles focus there.
    // A fragment in the URL means an anchor is the intended destination.
    if (key === 'default' || hash !== '') {
      return;
    }
    headingRef.current?.focus({ preventScroll: navigationType === NavigationType.Pop });
  }, [key, hash, navigationType]);

  return headingRef;
}
