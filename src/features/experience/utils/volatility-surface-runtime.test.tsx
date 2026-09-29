import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { type SurfaceReading } from '@/features/experience/types/volatility-lab';
import { startVolatilitySurface } from '@/features/experience/utils/volatility-surface-runtime';

const AXES = {
  strikeTitle: 'Prix d’exercice K',
  maturityTitle: 'Maturité T',
  maturityTicks: [{ years: 1, label: '1 an' }],
};

// A canvas carrying its colours as the lab sets them (VolatilityLab).
function labCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  canvas.style.cssText =
    'display:block;width:640px;height:440px;color:rgb(160,160,160);border-color:rgb(40,40,40) rgb(240,240,240) rgb(60,60,60) rgb(30,30,30)';
  document.body.append(canvas);
  return canvas;
}

function pixels(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const context = canvas.getContext('2d');
  return context === null
    ? new Uint8ClampedArray()
    : context.getImageData(0, 0, canvas.width, canvas.height).data;
}

// Viridis runs from violet through teal to yellow: its teal is green and blue together.
function hasViridisTeal(canvas: HTMLCanvasElement): boolean {
  const data = pixels(canvas);
  for (let index = 0; index < data.length; index += 4) {
    const [red = 0, green = 0, blue = 0] = [data[index], data[index + 1], data[index + 2]];
    if (green > 100 && blue > 100 && red < 60) {
      return true;
    }
  }
  return false;
}

let stop: (() => void) | null = null;

afterEach(() => {
  stop?.();
  stop = null;
  document.body.replaceChildren();
});

describe('startVolatilitySurface', () => {
  it('solves the surface in the browser, says how long it took, and draws it', async () => {
    const canvas = labCanvas();
    const onMeasured = vi.fn<(milliseconds: number) => void>();

    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: true,
      onMeasured,
      onReadout: () => undefined,
    });

    expect(onMeasured).toHaveBeenCalledOnce();
    expect(onMeasured.mock.calls[0]?.[0]).toBeGreaterThan(0);
    await expect.poll(() => hasViridisTeal(canvas)).toBe(true);
  });

  it('rises from a flat heat map when motion is welcome', async () => {
    const canvas = labCanvas();

    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: false,
      onMeasured: () => undefined,
      onReadout: () => undefined,
    });

    await expect.poll(() => hasViridisTeal(canvas), { timeout: 4000 }).toBe(true);
  });

  it('reads the point under the pointer: its volatility, strike and maturity', () => {
    const canvas = labCanvas();
    const readings: (SurfaceReading | null)[] = [];
    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: true,
      onMeasured: () => undefined,
      onReadout: (reading) => {
        readings.push(reading);
      },
    });

    const box = canvas.getBoundingClientRect();
    canvas.dispatchEvent(
      new PointerEvent('pointermove', {
        pointerType: 'mouse',
        clientX: box.left + box.width / 2,
        clientY: box.top + box.height / 2,
      }),
    );

    const reading = readings.at(-1);
    expect(reading?.sigma).toBeGreaterThan(0.15);
    expect(reading?.sigma).toBeLessThan(0.3);
    expect(reading?.strike).toBeGreaterThanOrEqual(70);
    expect(reading?.maturity).toBeGreaterThan(0);
  });

  it('turns with its buttons', async () => {
    const canvas = labCanvas();
    const controls = document.createElement('div');
    const button = document.createElement('button');
    button.dataset['turn'] = 'left';
    controls.append(button);
    document.body.append(controls);
    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls,
      isStill: true,
      onMeasured: () => undefined,
      onReadout: () => undefined,
    });
    await expect.poll(() => hasViridisTeal(canvas)).toBe(true);
    const before = pixels(canvas).join();

    button.click();

    await expect.poll(() => pixels(canvas).join() === before).toBe(false);
  });

  it('turns with the arrow keys', async () => {
    const canvas = labCanvas();
    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: true,
      onMeasured: () => undefined,
      onReadout: () => undefined,
    });
    await expect.poll(() => hasViridisTeal(canvas)).toBe(true);
    const before = pixels(canvas).join();

    canvas.focus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');

    await expect.poll(() => pixels(canvas).join() === before).toBe(false);
  });

  it('turns as the pointer drags it, and lets the reading go when the pointer leaves', async () => {
    const canvas = labCanvas();
    const readings: (SurfaceReading | null)[] = [];
    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: true,
      onMeasured: () => undefined,
      onReadout: (reading) => {
        readings.push(reading);
      },
    });
    await expect.poll(() => hasViridisTeal(canvas)).toBe(true);
    const before = pixels(canvas).join();
    const box = canvas.getBoundingClientRect();
    const at = (x: number): PointerEventInit => ({
      pointerId: 1,
      pointerType: 'mouse',
      clientX: box.left + x,
      clientY: box.top + box.height / 2,
    });

    canvas.dispatchEvent(new PointerEvent('pointerdown', at(200)));
    canvas.dispatchEvent(new PointerEvent('pointermove', at(320)));
    canvas.dispatchEvent(new PointerEvent('pointerup', at(320)));

    await expect.poll(() => pixels(canvas).join() === before).toBe(false);
    canvas.dispatchEvent(new PointerEvent('pointermove', at(320)));
    expect(readings.at(-1)).not.toBeNull();
    canvas.dispatchEvent(new PointerEvent('pointerleave', at(700)));
    expect(readings.at(-1)).toBeNull();
  });

  it('reads the point a finger taps, where there is no hover', async () => {
    const canvas = labCanvas();
    const readings: (SurfaceReading | null)[] = [];
    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: true,
      onMeasured: () => undefined,
      onReadout: (reading) => {
        readings.push(reading);
      },
    });
    await expect.poll(() => hasViridisTeal(canvas)).toBe(true);
    const box = canvas.getBoundingClientRect();

    canvas.dispatchEvent(
      new MouseEvent('click', {
        clientX: box.left + box.width / 2,
        clientY: box.top + box.height / 2,
      }),
    );
    canvas.dispatchEvent(new MouseEvent('click', { clientX: box.left + 2, clientY: box.top + 2 }));

    expect(readings).toHaveLength(1);
    expect(readings[0]?.sigma).toBeGreaterThan(0.15);
  });

  it('leaves other keys to the page', () => {
    const canvas = labCanvas();
    stop = startVolatilitySurface(canvas, {
      axes: AXES,
      controls: canvas,
      isStill: true,
      onMeasured: () => undefined,
      onReadout: () => undefined,
    });

    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    canvas.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
