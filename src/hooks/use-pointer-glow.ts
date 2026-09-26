import { useEffect } from 'react';

const POINTER_VARIABLES = ['--pointer-x', '--pointer-y', '--pointer-rx', '--pointer-ry'];

function clearPointer(element: HTMLElement): void {
  for (const name of POINTER_VARIABLES) {
    element.style.removeProperty(name);
  }
}

// One delegated listener for the whole page: any `[data-pointer]` element receives the
// pointer position as CSS variables, and motion.css turns them into a spotlight, a tilt or
// a magnet. Components stay render-only: they opt in with an attribute. The styles apply
// to a precise hovering pointer only; touch is ignored here, it has no hover.
export function usePointerGlow(): void {
  useEffect(() => {
    let activeElement: HTMLElement | null = null;

    function setActiveElement(element: HTMLElement | null): void {
      if (element !== activeElement && activeElement !== null) {
        clearPointer(activeElement);
      }
      activeElement = element;
    }

    // Leaving the window fires no pointermove on the page: without this, a card would stay
    // tilted.
    function handlePointerLeave(): void {
      setActiveElement(null);
    }

    function handlePointerMove(event: PointerEvent): void {
      const target =
        event.pointerType === 'mouse' && event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-pointer]')
          : null;
      setActiveElement(target);
      if (target === null) {
        return;
      }
      const { left, top, width, height } = target.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      target.style.setProperty('--pointer-x', `${String(x)}px`);
      target.style.setProperty('--pointer-y', `${String(y)}px`);
      target.style.setProperty('--pointer-rx', String((x / width) * 2 - 1));
      target.style.setProperty('--pointer-ry', String((y / height) * 2 - 1));
    }

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      setActiveElement(null);
    };
  }, []);
}
