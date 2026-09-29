import { describe, expect, it } from 'vitest';

import { SURFACE_GRID } from '@/features/experience/data/surface-grid';
import { VOLATILITY_RANGE } from '@/features/experience/data/volatility-range';
import { marketVolatility } from '@/features/experience/utils/implied-volatility';
import {
  marketPrices,
  maturityAt,
  sigmaAt,
  solveSurface,
  strikeAt,
} from '@/features/experience/utils/volatility-grid';

describe('the lab grid', () => {
  it('spans the strikes around the spot and the maturities up to two years', () => {
    expect([strikeAt(0), strikeAt(SURFACE_GRID.strikes - 1)]).toEqual([70, 130]);
    expect([maturityAt(0), maturityAt(SURFACE_GRID.maturities - 1)]).toEqual([0.08, 2]);
  });

  it('solves 1 536 volatilities, one per point, back to the market that priced them', () => {
    const surface = solveSurface(marketPrices());

    expect(surface.sigmas).toHaveLength(1536);
    expect(sigmaAt(surface, 10, 20)).toBeCloseTo(marketVolatility(strikeAt(10), maturityAt(20)), 8);
  });

  it('keeps the legend printed on the page true to the surface it draws', () => {
    const { low, high } = solveSurface(marketPrices());

    expect(Math.round(low * 100)).toBe(Math.round(VOLATILITY_RANGE.low * 100));
    expect(Math.round(high * 100)).toBe(Math.round(VOLATILITY_RANGE.high * 100));
  });
});
