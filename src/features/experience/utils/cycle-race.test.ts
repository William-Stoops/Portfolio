import { describe, expect, it } from 'vitest';

import { raceFrame, raceMinutes } from '@/features/experience/utils/cycle-race';

// The CV's figures: a cycle of ten hours before the redesign, of five minutes after.
const TIMES = { beforeMinutes: 600, afterMinutes: 5 } as const;

describe('raceMinutes', () => {
  it('runs an hour of the real cycle in 1.2 seconds, the old cycle in 12', () => {
    expect(raceMinutes(1200, TIMES)).toBe(60);
    expect(raceMinutes(12_000, TIMES)).toBe(600);
  });

  it('moves on one new cycle at a time', () => {
    expect(raceMinutes(0, TIMES)).toBe(0);
    expect(raceMinutes(99, TIMES)).toBe(0);
    expect(raceMinutes(100, TIMES)).toBe(5);
    expect(raceMinutes(4130, TIMES)).toBe(205);
  });

  it('stops as the old version completes its first cycle', () => {
    expect(raceMinutes(60_000, TIMES)).toBe(600);
  });
});

describe('raceFrame', () => {
  it('starts both versions from nothing', () => {
    expect(raceFrame(0, TIMES)).toEqual({
      beforeShare: 0,
      afterShare: 0,
      afterCycles: 0,
      clock: { hours: 0, minutes: 0 },
      isFinished: false,
    });
  });

  it('has the new version done with its first cycle while the old one has barely begun', () => {
    expect(raceFrame(5, TIMES)).toEqual({
      beforeShare: 5 / 600,
      afterShare: 1,
      afterCycles: 1,
      clock: { hours: 0, minutes: 5 },
      isFinished: false,
    });
  });

  it('counts sixty new cycles halfway through the old one', () => {
    expect(raceFrame(300, TIMES)).toMatchObject({
      beforeShare: 0.5,
      afterCycles: 60,
      clock: { hours: 5, minutes: 0 },
    });
  });

  it('ends on one old cycle against a hundred and twenty new ones', () => {
    expect(raceFrame(600, TIMES)).toEqual({
      beforeShare: 1,
      afterShare: 1,
      afterCycles: 120,
      clock: { hours: 10, minutes: 0 },
      isFinished: true,
    });
  });
});
