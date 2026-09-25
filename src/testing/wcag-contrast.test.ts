import { describe, expect, it } from 'vitest';

import { contrastRatio } from '@/testing/wcag-contrast';

describe('contrastRatio', () => {
  it('gives 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
  });

  it('gives 1 for identical colours', () => {
    expect(contrastRatio('#1B1F2A', '#1B1F2A')).toBe(1);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#FF7A45', '#12151C')).toBe(contrastRatio('#12151C', '#FF7A45'));
  });

  it('matches the WCAG reference value for #767676 on white (4.54)', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
  });

  it('accepts lowercase hex', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 2);
  });

  it('rejects anything that is not a 6-digit hex colour', () => {
    expect(() => contrastRatio('red', '#000000')).toThrow(/6-digit hex/);
  });
});
