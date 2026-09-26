// Touches for a precise hovering pointer, loaded on demand (useDesktopEnhancements): a
// cursor ring that follows the pointer and names the action under it, and texts that
// decode themselves when hovered. Both are decoration: the native cursor stays, and the
// decoded texts are aria-hidden copies of text read elsewhere.

// Share of the remaining distance the ring covers per frame: a soft trail, no lag.
const CURSOR_EASING = 0.22;
const SCRAMBLE_DURATION_MS = 650;
const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]=+*#';
// What the ring reacts to; fields hide it so it never covers the caret.
const INTERACTIVE_SELECTOR = 'a, button, [data-cursor]';
const FIELD_SELECTOR = 'input, textarea, select';

function startCursorFollower(): () => void {
  const cursor = document.createElement('div');
  cursor.setAttribute('data-cursor-follower', '');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.className =
    'pointer-events-none fixed top-0 left-0 z-(--z-cursor) -mt-4 -ml-4 grid size-8 place-items-center overflow-hidden rounded-full border-2 border-accent text-[0] font-semibold whitespace-nowrap text-on-accent opacity-0 transition-[opacity,width,height,margin,background-color,font-size] duration-250 ease-out data-active:-mt-6 data-active:-ml-6 data-active:size-12 data-labelled:-mt-9 data-labelled:-ml-9 data-labelled:size-18 data-labelled:bg-accent data-labelled:text-small data-visible:opacity-100';
  document.body.append(cursor);

  let position: [number, number] | null = null;
  let target: [number, number] = [0, 0];
  let frameHandle = 0;

  function setFlag(name: string, isOn: boolean): void {
    cursor.toggleAttribute(`data-${name}`, isOn);
  }

  function frame(): void {
    const [x, y] = position ?? target;
    const nextX = x + (target[0] - x) * CURSOR_EASING;
    const nextY = y + (target[1] - y) * CURSOR_EASING;
    const isSettled = Math.abs(target[0] - nextX) < 0.1 && Math.abs(target[1] - nextY) < 0.1;
    position = isSettled ? target : [nextX, nextY];
    cursor.style.translate = `${String(position[0])}px ${String(position[1])}px`;
    frameHandle = isSettled ? 0 : requestAnimationFrame(frame);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') {
      return;
    }
    target = [event.clientX, event.clientY];
    // The first position is taken at once: the ring does not fly in from a corner.
    position ??= target;
    setFlag('visible', true);
    if (frameHandle === 0) {
      frameHandle = requestAnimationFrame(frame);
    }
  }

  function handlePointerOver(event: PointerEvent): void {
    const element = event.target instanceof Element ? event.target : null;
    const interactive = element?.closest<HTMLElement>(INTERACTIVE_SELECTOR) ?? null;
    const label = interactive?.getAttribute('data-cursor') ?? '';
    cursor.textContent = label;
    setFlag('active', interactive !== null);
    setFlag('labelled', label !== '');
    setFlag('visible', element?.closest(FIELD_SELECTOR) === null || element === null);
  }

  function handlePointerLeave(): void {
    setFlag('visible', false);
  }

  document.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerover', handlePointerOver, { passive: true });
  document.documentElement.addEventListener('pointerleave', handlePointerLeave);

  return () => {
    cancelAnimationFrame(frameHandle);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerover', handlePointerOver);
    document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    cursor.remove();
  };
}

function scrambledText(text: string, revealedCount: number): string {
  return Array.from(text, (character, index) =>
    index < revealedCount || character === ' '
      ? character
      : (SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)] ?? character),
  ).join('');
}

// Hovering a [data-scramble] text shuffles it, then reveals it back from left to right,
// like a terminal decoding a line.
function startScrambleOnHover(): () => void {
  const originals = new Map<HTMLElement, string>();
  const frameHandles = new Map<HTMLElement, number>();

  function decode(element: HTMLElement, text: string, startTime: number, now: number): void {
    const progress = Math.min((now - startTime) / SCRAMBLE_DURATION_MS, 1);
    element.textContent =
      progress === 1 ? text : scrambledText(text, Math.floor(progress * text.length));
    if (progress === 1) {
      frameHandles.delete(element);
      return;
    }
    frameHandles.set(
      element,
      requestAnimationFrame((next) => {
        decode(element, text, startTime, next);
      }),
    );
  }

  function handlePointerOver(event: PointerEvent): void {
    const element =
      event.pointerType === 'mouse' && event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-scramble]')
        : null;
    if (element === null || frameHandles.has(element)) {
      return;
    }
    const text = originals.get(element) ?? element.textContent;
    originals.set(element, text);
    const startTime = performance.now();
    element.textContent = scrambledText(text, 0);
    frameHandles.set(
      element,
      requestAnimationFrame((now) => {
        decode(element, text, startTime, now);
      }),
    );
  }

  document.addEventListener('pointerover', handlePointerOver, { passive: true });

  return () => {
    document.removeEventListener('pointerover', handlePointerOver);
    for (const [element, handle] of frameHandles) {
      cancelAnimationFrame(handle);
      element.textContent = originals.get(element) ?? element.textContent;
    }
  };
}

export function startDesktopEnhancements(): () => void {
  const stopCursor = startCursorFollower();
  const stopScramble = startScrambleOnHover();
  return () => {
    stopCursor();
    stopScramble();
  };
}
