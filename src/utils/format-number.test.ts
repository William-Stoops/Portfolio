import { describe, expect, it } from 'vitest';

import { formatNumber } from '@/utils/format-number';

describe('formatNumber', () => {
  it('groups thousands as each language does', () => {
    expect(formatNumber(1500, 'fr')).toBe('1 500');
    expect(formatNumber(1500, 'en')).toBe('1,500');
  });

  it('keeps the decimals it is asked for, with the comma in French', () => {
    expect(formatNumber(0.7349, 'fr', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe(
      '0,73',
    );
    expect(formatNumber(19.94, 'en', { maximumFractionDigits: 1 })).toBe('19.9');
  });
});
