import { describe, expect, it } from 'vitest';

import { VOLATILITY_LAB as VOLATILITY_LAB_EN } from '@/features/experience/data/volatility-lab.en';
import { VOLATILITY_LAB } from '@/features/experience/data/volatility-lab.fr';

describe('the lab’s words', () => {
  it('counts the volatilities it solves, and says how fast once measured', () => {
    expect(VOLATILITY_LAB.measure.solved).toBe('1 536 volatilités retrouvées par Newton-Raphson');
    expect(VOLATILITY_LAB.measure.duration(0.7349)).toBe(' en 0,73 ms');
    expect(VOLATILITY_LAB_EN.measure.solved).toBe('1,536 volatilities found by Newton-Raphson');
    expect(VOLATILITY_LAB_EN.measure.duration(0.7349)).toBe(' in 0.73 ms');
  });

  it('prints the legend’s range as the surface spans it', () => {
    expect(VOLATILITY_LAB.legend).toEqual({ low: 'σ 15 %', high: '30 %' });
    expect(VOLATILITY_LAB_EN.legend).toEqual({ low: 'σ 15%', high: '30%' });
  });

  it('reads a point in each language’s numbers, maturities in months under a year', () => {
    const { readout } = VOLATILITY_LAB;
    expect([readout.sigma(0.1994), readout.strike(108.26), readout.maturity(1.44)]).toEqual([
      'σ 19,9 %',
      'K 108,3',
      'T 1,44 an',
    ]);
    expect(readout.maturity(0.7)).toBe('T 8,4 mois');
    expect(readout.maturity(2)).toBe('T 2,00 ans');
    expect(VOLATILITY_LAB_EN.readout.maturity(0.7)).toBe('T 8.4 months');
  });

  it('labels the axes in the page’s language', () => {
    expect(VOLATILITY_LAB.axes.maturityTicks.map(({ label }) => label)).toEqual([
      '3 mois',
      '1 an',
      '2 ans',
    ]);
    expect(VOLATILITY_LAB_EN.axes.strikeTitle).toBe('Strike K');
  });
});
