import { useEffect } from 'react';

import { whenIdle } from '@/lib/when-idle';

const RENDER_ALL_ATTRIBUTE = 'data-render-all';

// `.defer-render` blocks start with a placeholder size and skip their first render (ADR
// 0018). This finishes the job without long tasks: one block per idle period. As soon as
// the visitor moves (a scroll, an in-page link pressed, a key, a hash change), everything
// is rendered at once, first, so nothing shifts under the pointer or away from an anchor.
export function useProgressiveRender(): void {
  useEffect(() => {
    const root = document.documentElement;
    const blocks = [...document.querySelectorAll<HTMLElement>('.defer-render')];
    let cancelIdle = (): void => undefined;

    function renderAll(): void {
      root.setAttribute(RENDER_ALL_ATTRIBUTE, '');
      stop();
    }

    function handlePointerDown(event: PointerEvent): void {
      if (event.target instanceof Element && event.target.closest('a[href*="#"]') !== null) {
        renderAll();
      }
    }

    function renderNext(index: number): void {
      const block = blocks[index];
      if (block === undefined) {
        return;
      }
      cancelIdle = whenIdle(() => {
        block.setAttribute('data-rendered', '');
        renderNext(index + 1);
      });
    }

    function stop(): void {
      cancelIdle();
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', renderAll, true);
      window.removeEventListener('hashchange', renderAll);
      window.removeEventListener('scroll', renderAll);
    }

    if (root.hasAttribute(RENDER_ALL_ATTRIBUTE)) {
      return undefined;
    }
    // Capture phase: before the link's default action scrolls the page.
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', renderAll, true);
    window.addEventListener('hashchange', renderAll);
    window.addEventListener('scroll', renderAll, { passive: true });
    renderNext(0);
    return stop;
  }, []);
}
