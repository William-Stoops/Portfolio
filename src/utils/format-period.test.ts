import { describe, expect, it } from 'vitest';

import { formatPeriod } from '@/utils/format-period';

describe('formatPeriod', () => {
  it('says "Depuis" for an ongoing role, with the French short month', () => {
    expect(formatPeriod({ start: '2025-09' }, 'fr')).toBe('Depuis sept. 2025');
  });

  it('says "Since" in English, with the English short month', () => {
    expect(formatPeriod({ start: '2025-09' }, 'en')).toBe('Since Sep 2025');
  });

  it('shows a single year when the role started and ended the same year', () => {
    expect(formatPeriod({ start: '2024', end: '2024' }, 'fr')).toBe('2024');
  });

  it('joins a range of years with a spaced en dash, in both languages', () => {
    expect(formatPeriod({ start: '2022', end: '2024' }, 'fr')).toBe('2022 – 2024');
    expect(formatPeriod({ start: '2022', end: '2024' }, 'en')).toBe('2022 – 2024');
  });

  it('formats month precision on both ends, in the language of the page', () => {
    expect(formatPeriod({ start: '2023-01', end: '2024-06' }, 'fr')).toBe('janv. 2023 – juin 2024');
    expect(formatPeriod({ start: '2023-01', end: '2024-06' }, 'en')).toBe('Jan 2023 – Jun 2024');
  });
});
