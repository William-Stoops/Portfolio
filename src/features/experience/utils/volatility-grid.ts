import { SURFACE_GRID } from '@/features/experience/data/surface-grid';
import {
  impliedVolatility,
  marketVolatility,
  optionPrice,
} from '@/features/experience/utils/implied-volatility';

export type VolatilitySurface = {
  // One implied volatility per strike and maturity, strike-major.
  sigmas: Float64Array;
  low: number;
  high: number;
};

export function strikeAt(index: number): number {
  const { strikes, strikeMin, strikeMax } = SURFACE_GRID;
  return strikeMin + ((strikeMax - strikeMin) * index) / (strikes - 1);
}

export function maturityAt(index: number): number {
  const { maturities, maturityMin, maturityMax } = SURFACE_GRID;
  return maturityMin + ((maturityMax - maturityMin) * index) / (maturities - 1);
}

export function sigmaAt(surface: VolatilitySurface, strike: number, maturity: number): number {
  return surface.sigmas[strike * SURFACE_GRID.maturities + maturity] ?? 0;
}

// The market's prices for the whole grid: what the solver is given.
export function marketPrices(): Float64Array {
  const prices = new Float64Array(SURFACE_GRID.strikes * SURFACE_GRID.maturities);
  for (let strike = 0; strike < SURFACE_GRID.strikes; strike += 1) {
    for (let maturity = 0; maturity < SURFACE_GRID.maturities; maturity += 1) {
      const k = strikeAt(strike);
      const t = maturityAt(maturity);
      prices[strike * SURFACE_GRID.maturities + maturity] = optionPrice(
        k,
        t,
        marketVolatility(k, t),
      );
    }
  }
  return prices;
}

// Every price of the grid turned back into its volatility: the work the lab times.
export function solveSurface(prices: Float64Array): VolatilitySurface {
  const sigmas = new Float64Array(prices.length);
  let low = Number.POSITIVE_INFINITY;
  let high = Number.NEGATIVE_INFINITY;
  for (let strike = 0; strike < SURFACE_GRID.strikes; strike += 1) {
    for (let maturity = 0; maturity < SURFACE_GRID.maturities; maturity += 1) {
      const index = strike * SURFACE_GRID.maturities + maturity;
      const sigma = impliedVolatility(prices[index] ?? 0, strikeAt(strike), maturityAt(maturity));
      sigmas[index] = sigma;
      low = Math.min(low, sigma);
      high = Math.max(high, sigma);
    }
  }
  return { sigmas, low, high };
}
