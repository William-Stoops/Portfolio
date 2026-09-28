import { describe, expect, it } from 'vitest';

import { formatNumber } from '@/utils/format-number';

describe('formatNumber', () => {
  it('groups thousands as each language does', () => {
    expect(formatNumber(1500, 'fr')).toBe('1 500');
    expect(formatNumber(1500, 'en')).toBe('1,500');
  });
});
