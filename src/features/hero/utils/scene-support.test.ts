import { describe, expect, it } from 'vitest';

import { canRunHeroScene, parseRgbColor } from '@/features/hero/utils/scene-support';

const DESKTOP_QUERIES = new Set([
  '(prefers-reduced-motion: no-preference)',
  '(min-width: 64rem)',
  '(hover: hover) and (pointer: fine)',
]);

describe('canRunHeroScene', () => {
  it('runs on a large screen with a precise pointer, motion allowed and data not saved', () => {
    expect(canRunHeroScene((query) => DESKTOP_QUERIES.has(query), false)).toBe(true);
  });

  it.each([...DESKTOP_QUERIES])('stays off when %s does not match', (missing) => {
    expect(canRunHeroScene((query) => query !== missing && DESKTOP_QUERIES.has(query), false)).toBe(
      false,
    );
  });

  it('stays off when the visitor saves data', () => {
    expect(canRunHeroScene((query) => DESKTOP_QUERIES.has(query), true)).toBe(false);
  });
});

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
