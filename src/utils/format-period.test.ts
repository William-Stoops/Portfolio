import { describe, expect, it } from 'vitest';

import { formatPeriod } from '@/utils/format-period';

describe('formatPeriod', () => {
  it('says "Depuis" for an ongoing role, with the French short month', () => {
    expect(formatPeriod({ start: '2025-09' })).toBe('Depuis sept. 2025');
  });

  it('shows a single year when the role started and ended the same year', () => {
    expect(formatPeriod({ start: '2024', end: '2024' })).toBe('2024');
  });

  it('joins a range of years with a spaced en dash', () => {
    expect(formatPeriod({ start: '2022', end: '2024' })).toBe('2022 – 2024');
  });

  it('formats month precision on both ends', () => {
    expect(formatPeriod({ start: '2023-01', end: '2024-06' })).toBe('janv. 2023 – juin 2024');
  });
});
