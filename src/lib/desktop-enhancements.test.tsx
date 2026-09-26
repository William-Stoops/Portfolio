import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { startDesktopEnhancements } from '@/lib/desktop-enhancements';

let stop = (): void => undefined;

afterEach(() => {
  stop();
});

function nextFrames(count: number): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count;
    function tick(): void {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  });
}

function movePointer(target: Element, clientX: number, clientY: number): void {
  target.dispatchEvent(
    new PointerEvent('pointermove', { bubbles: true, clientX, clientY, pointerType: 'mouse' }),
  );
  target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
}

function cursorElement(): HTMLElement {
  const cursor = document.querySelector<HTMLElement>('[data-cursor-follower]');
  if (cursor === null) {
    throw new Error('no cursor');
  }
  return cursor;
}

describe('startDesktopEnhancements', () => {
  it('adds a cursor ring that follows the pointer, hidden from assistive tech', async () => {
    stop = startDesktopEnhancements();
    const cursor = cursorElement();
    expect(cursor.getAttribute('aria-hidden')).toBe('true');

    movePointer(document.body, 200, 120);
    await nextFrames(40);

    expect(cursor.style.translate).toBe('200px 120px');
  });

  it('names the action of the element under the pointer', async () => {
    const screen = await render(
      <a href="#video" data-cursor="Lire">
        Vidéo
      </a>,
    );
    stop = startDesktopEnhancements();

    movePointer(screen.getByRole('link').element(), 10, 10);

    await expect.poll(() => cursorElement().textContent).toBe('Lire');
    expect(cursorElement().hasAttribute('data-active')).toBe(true);
  });

  it('decodes a scrambled text back to itself when hovered', async () => {
    const screen = await render(<span data-scramble>Software Engineer</span>);
    stop = startDesktopEnhancements();
    const text = screen.getByText('Software Engineer').element();

    text.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    await nextFrames(2);
    expect(text.textContent).not.toBe('Software Engineer');

    await expect.poll(() => text.textContent, { timeout: 3000 }).toBe('Software Engineer');
  });

  it('steps aside over a text field, so it never covers the caret', async () => {
    const screen = await render(<input aria-label="Nom" />);
    stop = startDesktopEnhancements();
    movePointer(document.body, 50, 50);
    expect(cursorElement().hasAttribute('data-visible')).toBe(true);

    movePointer(screen.getByRole('textbox').element(), 60, 60);

    expect(cursorElement().hasAttribute('data-visible')).toBe(false);
  });

  it('hides when the pointer leaves the window, and ignores touch', () => {
    stop = startDesktopEnhancements();
    movePointer(document.body, 50, 50);

    document.documentElement.dispatchEvent(new PointerEvent('pointerleave'));
    expect(cursorElement().hasAttribute('data-visible')).toBe(false);
    document.body.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: 9,
        clientY: 9,
        pointerType: 'touch',
      }),
    );

    expect(cursorElement().hasAttribute('data-visible')).toBe(false);
  });

  it('restores a text being decoded when stopped', async () => {
    const screen = await render(<span data-scramble>Software Engineer</span>);
    stop = startDesktopEnhancements();
    const text = screen.getByText('Software Engineer').element();
    text.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));

    stop();

    expect(text.textContent).toBe('Software Engineer');
  });

  it('removes everything when stopped', () => {
    stop = startDesktopEnhancements();

    stop();

    expect(document.querySelector('[data-cursor-follower]')).toBeNull();
  });
});
