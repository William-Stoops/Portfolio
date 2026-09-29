import { describe, expect, it } from 'vitest';

import { VIRIDIS_GRADIENT, viridis } from '@/features/experience/utils/viridis';

describe('viridis', () => {
  it('runs from deep violet to yellow', () => {
    expect(viridis(0)).toEqual([68, 1, 84]);
    expect(viridis(1)).toEqual([253, 231, 37]);
  });

  it('interpolates between its stops, and clamps outside 0 to 1', () => {
    const [red] = viridis(0.5);
    expect(red).toBeGreaterThan(31);
    expect(red).toBeLessThan(39);
    expect(viridis(-1)).toEqual(viridis(0));
    expect(viridis(2)).toEqual(viridis(1));
  });

  it('gives the legend the same scale as a CSS gradient', () => {
    expect(VIRIDIS_GRADIENT).toMatch(/^linear-gradient\(90deg, #440154, .*#fde725\)$/);
  });
});
