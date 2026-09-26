import { describe, expect, it } from 'vitest';

import { formatTwoDigits } from '@/utils/format-two-digits';

describe('formatTwoDigits', () => {
  it('pads a single digit with a zero', () => {
    expect([1, 9, 10, 42].map((value) => formatTwoDigits(value))).toEqual(['01', '09', '10', '42']);
  });
});
