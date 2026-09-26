import { useEffect } from 'react';

const RENDER_ALL_ATTRIBUTE = 'data-render-all';

// `.defer-render` blocks skip their first render and keep a placeholder size until they
// near the viewport (ADR 0018). As soon as the visitor moves (a scroll, an in-page link
// pressed, a key, a hash change), everything is rendered at once, first, so nothing shifts
// under the pointer or away from an anchor. No work is scheduled while the page idles:
// on a slow phone, each block rendered then is a long task of its own.
export function useProgressiveRender(): void {
  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute(RENDER_ALL_ATTRIBUTE)) {
      return undefined;
    }

    function renderAll(): void {
      root.setAttribute(RENDER_ALL_ATTRIBUTE, '');
      stop();
    }

    function handlePointerDown(event: PointerEvent): void {
      if (event.target instanceof Element && event.target.closest('a[href*="#"]') !== null) {
        renderAll();
      }
    }

    function stop(): void {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', renderAll, true);
      window.removeEventListener('hashchange', renderAll);
      window.removeEventListener('scroll', renderAll);
    }

    // Capture phase: before the link's default action scrolls the page.
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', renderAll, true);
    window.addEventListener('hashchange', renderAll);
    window.addEventListener('scroll', renderAll, { passive: true });
    return stop;
  }, []);
}
