import { describe, expect, it } from 'vitest';

import { canRunHeroScene } from '@/features/hero/utils/scene-support';

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
