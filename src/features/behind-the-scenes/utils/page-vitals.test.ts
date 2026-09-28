import { describe, expect, it } from 'vitest';

import { cumulativeLayoutShift, scriptBytes } from '@/features/behind-the-scenes/utils/page-vitals';

describe('cumulativeLayoutShift', () => {
  it('is nothing when nothing moved', () => {
    expect(cumulativeLayoutShift([])).toBe(0);
  });

  it('adds up the shifts of one session, less than a second apart', () => {
    expect(
      cumulativeLayoutShift([
        { value: 0.01, startTime: 100, hadRecentInput: false },
        { value: 0.02, startTime: 900, hadRecentInput: false },
      ]),
    ).toBeCloseTo(0.03);
  });

  it('scores the worst session, not the whole visit', () => {
    expect(
      cumulativeLayoutShift([
        { value: 0.01, startTime: 100, hadRecentInput: false },
        { value: 0.02, startTime: 3000, hadRecentInput: false },
        { value: 0.015, startTime: 3500, hadRecentInput: false },
      ]),
    ).toBeCloseTo(0.035);
  });

  it('closes a session after five seconds, however close its shifts', () => {
    const everyHalfSecond = Array.from({ length: 12 }, (_, index) => ({
      value: 0.01,
      startTime: index * 500,
      hadRecentInput: false,
    }));

    expect(cumulativeLayoutShift(everyHalfSecond)).toBeCloseTo(0.1);
  });

  it('leaves out the shifts that follow the visitor’s own input', () => {
    expect(
      cumulativeLayoutShift([
        { value: 0.3, startTime: 100, hadRecentInput: true },
        { value: 0.01, startTime: 200, hadRecentInput: false },
      ]),
    ).toBeCloseTo(0.01);
  });
});

describe('scriptBytes', () => {
  it('adds up the scripts as they travelled, compressed, and nothing else', () => {
    expect(
      scriptBytes([
        { name: 'https://example.test/assets/index-a1.js', encodedBodySize: 40_000 },
        { name: 'https://example.test/assets/home-journey-b2.js?v=1', encodedBodySize: 15_000 },
        { name: 'https://example.test/assets/index-c3.css', encodedBodySize: 12_000 },
        { name: 'https://example.test/images/portrait.avif', encodedBodySize: 30_000 },
      ]),
    ).toBe(55_000);
  });
});
