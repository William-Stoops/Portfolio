import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { HeroScene } from '@/features/hero/components/hero-scene';

function sceneCanvas(container: HTMLElement): HTMLCanvasElement {
  const canvas = container.querySelector('canvas');
  if (canvas === null) {
    throw new Error('no canvas');
  }
  return canvas;
}

// Reads the drawn pixels in the frame the scene draws them, before the browser presents
// and clears the drawing buffer: the scene's frame callback was registered first.
function readsDrawnPixels(canvas: HTMLCanvasElement): Promise<boolean> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(hasDrawnPixels(canvas));
    });
  });
}

function hasDrawnPixels(canvas: HTMLCanvasElement): boolean {
  const gl = canvas.getContext('webgl2');
  if (gl === null) {
    return false;
  }
  const pixels = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels.some((value, index) => index % 4 === 3 && value > 0);
}

describe('HeroScene', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is a decoration, hidden from assistive tech and from the pointer', async () => {
    const screen = await render(<HeroScene />);

    const canvas = sceneCanvas(screen.container);
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
    expect(getComputedStyle(canvas).pointerEvents).toBe('none');
  });

  it('draws the surface on a large screen with a precise pointer', async () => {
    await page.viewport(1280, 800);
    const screen = await render(
      <div style={{ position: 'relative', width: 1280, height: 700 }}>
        <HeroScene />
      </div>,
    );
    const canvas = sceneCanvas(screen.container);

    await expect.poll(() => canvas.getAttribute('data-ready'), { timeout: 5000 }).toBe('');
    expect(canvas.width).toBeGreaterThan(0);
    await expect.poll(() => readsDrawnPixels(canvas)).toBe(true);
  });

  it('sends a ripple across the surface on click, and keeps drawing', async () => {
    await page.viewport(1280, 800);
    const screen = await render(
      <div style={{ position: 'relative', width: 1280, height: 700 }}>
        <HeroScene />
      </div>,
    );
    const canvas = sceneCanvas(screen.container);
    await expect.poll(() => canvas.getAttribute('data-ready'), { timeout: 5000 }).toBe('');
    const { left, top, width, height } = canvas.getBoundingClientRect();

    window.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: left + width * 0.7, clientY: top + height * 0.8 }),
    );

    await expect.poll(() => readsDrawnPixels(canvas)).toBe(true);
  });

  it('follows the pointer, the theme and the visibility of the hero', async () => {
    await page.viewport(1280, 800);
    const screen = await render(
      <div style={{ position: 'relative', width: 1280, height: 700 }}>
        <HeroScene />
      </div>,
    );
    const canvas = sceneCanvas(screen.container);
    await expect.poll(() => canvas.getAttribute('data-ready'), { timeout: 5000 }).toBe('');
    const { left, top, width, height } = canvas.getBoundingClientRect();

    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: left + width * 0.8, clientY: top + height * 0.9 }),
    );
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.dispatchEvent(new PointerEvent('pointerleave'));
    await expect.poll(() => readsDrawnPixels(canvas)).toBe(true);
    document.documentElement.removeAttribute('data-theme');

    // Off screen, the scene stops drawing; back on screen, it draws again.
    canvas.style.transform = 'translateY(-5000px)';
    await new Promise((resolve) => setTimeout(resolve, 300));
    canvas.style.transform = '';
    await expect.poll(() => readsDrawnPixels(canvas)).toBe(true);
  });

  it('stays off on a small screen', async () => {
    await page.viewport(390, 800);
    const screen = await render(<HeroScene />);

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(sceneCanvas(screen.container).hasAttribute('data-ready')).toBe(false);
  });

  it('keeps the static hero when the browser has no WebGL2', async () => {
    await page.viewport(1280, 800);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const screen = await render(<HeroScene />);

    await new Promise((resolve) => setTimeout(resolve, 800));

    expect(sceneCanvas(screen.container).hasAttribute('data-ready')).toBe(false);
  });
});
