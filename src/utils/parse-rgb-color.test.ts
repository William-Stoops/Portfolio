import { describe, expect, it } from 'vitest';

import { parseRgbColor } from '@/utils/parse-rgb-color';

describe('parseRgbColor', () => {
  it('reads a computed rgb() colour as WebGL channels from 0 to 1', () => {
    expect(parseRgbColor('rgb(110, 168, 254)')).toEqual([110 / 255, 168 / 255, 254 / 255]);
  });

  it('reads rgba() and ignores the alpha', () => {
    expect(parseRgbColor('rgba(0, 51, 255, 0.5)')).toEqual([0, 0.2, 1]);
  });

  it('gives nothing for a colour it cannot read', () => {
    expect(parseRgbColor('oklch(70% 0.1 40)')).toBeNull();
  });
});
