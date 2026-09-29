import { describe, expect, it } from 'vitest';

import {
  buildQuads,
  clampPitch,
  DEFAULT_CAMERA,
  fitView,
  pickQuad,
} from '@/features/experience/utils/surface-scene';
import { marketPrices, solveSurface } from '@/features/experience/utils/volatility-grid';

const SURFACE = solveSurface(marketPrices());
const WIDTH = 800;
const HEIGHT = 550;
const VIEW = fitView(SURFACE, WIDTH, HEIGHT, { x: 40, y: 26 });

describe('the lab surface', () => {
  it('frames the whole surface inside the canvas, margins kept', () => {
    const quads = buildQuads(SURFACE, DEFAULT_CAMERA, VIEW, { lift: 1, sweep: 1 });
    const corners = quads.flatMap(({ corners: points }) => points);

    expect(Math.min(...corners.map(([x]) => x))).toBeGreaterThanOrEqual(40 - 0.5);
    expect(Math.max(...corners.map(([x]) => x))).toBeLessThanOrEqual(WIDTH - 40 + 0.5);
    expect(Math.min(...corners.map(([, y]) => y))).toBeGreaterThanOrEqual(26 - 0.5);
    expect(Math.max(...corners.map(([, y]) => y))).toBeLessThanOrEqual(HEIGHT - 26 + 0.5);
  });

  it('draws every cell, farthest first, so the nearer relief hides what is behind it', () => {
    const quads = buildQuads(SURFACE, DEFAULT_CAMERA, VIEW, { lift: 1, sweep: 1 });

    expect(quads).toHaveLength(47 * 31);
    const depths = quads.map(({ depth }) => depth);
    expect(depths).toEqual(depths.toSorted((a, b) => b - a));
  });

  it('fills in during the intro, short maturities first', () => {
    const early = buildQuads(SURFACE, DEFAULT_CAMERA, VIEW, { lift: 0, sweep: 0.2 });
    const appearanceAt = (maturity: number): number =>
      early.find((quad) => quad.maturity === maturity)?.appear ?? 0;

    expect(buildQuads(SURFACE, DEFAULT_CAMERA, VIEW, { lift: 0, sweep: 0 })).toHaveLength(0);
    expect(Math.max(...early.map(({ maturity }) => maturity))).toBeLessThanOrEqual(18);
    expect(appearanceAt(0)).toBeGreaterThan(appearanceAt(10));
  });

  it('finds the cell under a point of the canvas, the front-most one', () => {
    const quads = buildQuads(SURFACE, DEFAULT_CAMERA, VIEW, { lift: 1, sweep: 1 });
    const target = quads.at(-1);
    if (target === undefined) {
      throw new Error('no cell');
    }
    const x = target.corners.reduce((sum, [cornerX]) => sum + cornerX, 0) / 4;
    const y = target.corners.reduce((sum, [, cornerY]) => sum + cornerY, 0) / 4;

    expect(pickQuad(quads, x, y)).toBe(target);
    expect(pickQuad(quads, -10, -10)).toBeNull();
  });

  it('never tilts under the floor nor past the view from above', () => {
    expect(clampPitch(-1)).toBe(0.12);
    expect(clampPitch(3)).toBe(1.3);
    expect(clampPitch(0.5)).toBe(0.5);
  });
});
