import { afterEach, describe, expect, it } from 'vitest';

import { startFlowField } from '@/features/hero/utils/flow-field-runtime';

// A canvas carrying its four tints as the hero sets them (FlowField): one colour for all,
// so every pixel of the field must come out in it.
function tintedCanvas(color: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `display:block;width:320px;height:200px;color:${color};border-color:${color}`;
  document.body.append(canvas);
  return canvas;
}

// Reads the field in the frame it is drawn, before the browser presents and clears it: the
// field's frame callback was registered first.
function centrePixel(canvas: HTMLCanvasElement): Promise<readonly number[]> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const gl = canvas.getContext('webgl2');
      const pixel = new Uint8Array(4);
      gl?.readPixels(
        Math.floor(canvas.width / 2),
        Math.floor(canvas.height / 2),
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel,
      );
      resolve([...pixel]);
    });
  });
}

let stop: (() => void) | null = null;

afterEach(() => {
  stop?.();
  stop = null;
  document.body.replaceChildren();
});

describe('startFlowField', () => {
  it('paints the field in the tints read from the design tokens on its canvas', async () => {
    const canvas = tintedCanvas('rgb(255, 0, 0)');

    stop = startFlowField(canvas);

    expect(stop).not.toBeNull();
    await expect.poll(() => centrePixel(canvas)).toEqual([255, 0, 0, 255]);
  });

  it('draws at half the size of the canvas on screen: a soft field needs no more', async () => {
    const canvas = tintedCanvas('rgb(0, 0, 255)');

    stop = startFlowField(canvas);

    await expect.poll(() => [canvas.width, canvas.height]).toEqual([160, 100]);
  });

  it('follows a new tint on the next frame, as when the theme changes', async () => {
    const canvas = tintedCanvas('rgb(255, 0, 0)');
    stop = startFlowField(canvas);
    await expect.poll(() => centrePixel(canvas)).toEqual([255, 0, 0, 255]);

    canvas.style.color = 'rgb(0, 255, 0)';
    canvas.style.borderColor = 'rgb(0, 255, 0)';
    document.documentElement.setAttribute('data-theme', 'dark');

    await expect.poll(() => centrePixel(canvas)).toEqual([0, 255, 0, 255]);
    document.documentElement.removeAttribute('data-theme');
  });
});
