// Touches for a precise hovering pointer, loaded on demand (useDesktopEnhancements): a
// cursor ring that trails the pointer and gives way over what can be clicked, and texts
// that decode themselves when hovered. Both are decoration: the native cursor stays, and the
// decoded texts are aria-hidden copies of text read elsewhere.

// Share of the remaining distance the ring covers per frame: a soft trail, no lag.
const CURSOR_EASING = 0.22;
const SCRAMBLE_DURATION_MS = 650;
const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]=+*#';
const INTERACTIVE_SELECTOR = 'a, button';
const FIELD_SELECTOR = 'input, textarea, select';

// The ring never covers what the visitor reads: over a link or a button, whose own hover
// already answers, it fades away.
function isInteractive(element: Element | null): boolean {
  return (element?.closest(INTERACTIVE_SELECTOR) ?? null) !== null;
}

function startCursorFollower(): () => void {
  const cursor = document.createElement('div');
  cursor.setAttribute('data-cursor-follower', '');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.className =
    'group pointer-events-none fixed top-0 left-0 z-(--z-cursor) opacity-0 transition-opacity duration-250 ease-out data-visible:opacity-100';
  const ring = document.createElement('span');
  ring.className =
    'absolute -top-4 -left-4 size-8 rounded-full border-2 border-accent transition-[opacity,scale] duration-250 ease-out group-data-over-control:scale-50 group-data-over-control:opacity-0';
  cursor.append(ring);
  document.body.append(cursor);

  let position: [number, number] | null = null;
  let target: [number, number] = [0, 0];
  let frameHandle = 0;

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
    cursor.toggleAttribute('data-visible', true);
    if (frameHandle === 0) {
      frameHandle = requestAnimationFrame(frame);
    }
  }

  function handlePointerOver(event: PointerEvent): void {
    const element = event.target instanceof Element ? event.target : null;
    cursor.toggleAttribute('data-over-control', isInteractive(element));
    // Over a text field it steps aside, so it never covers the caret.
    cursor.toggleAttribute('data-visible', (element?.closest(FIELD_SELECTOR) ?? null) === null);
  }

  function handlePointerLeave(): void {
    cursor.toggleAttribute('data-visible', false);
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
