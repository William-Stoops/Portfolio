import { describe, expect, it } from 'vitest';

import {
  impliedVolatility,
  marketVolatility,
  optionPrice,
} from '@/features/experience/utils/implied-volatility';

// Reference prices from Python's math.erfc, independent of the solver's own normal law.
describe('optionPrice', () => {
  it('prices as Black-Scholes does, a put below the forward and a call above it', () => {
    expect(optionPrice(95, 0.5, 0.2)).toBeCloseTo(3.001775502087291, 10);
    expect(optionPrice(110, 1, 0.2)).toBeCloseTo(4.943866957230483, 10);
  });

  it('prices the out-of-the-money side: a put below the forward, a call above', () => {
    // Both are worth more with more volatility, and nothing without time.
    expect(optionPrice(90, 1, 0.3)).toBeGreaterThan(optionPrice(90, 1, 0.2));
    expect(optionPrice(110, 1, 0.3)).toBeGreaterThan(optionPrice(110, 1, 0.2));
    expect(optionPrice(90, 1e-9, 0.2)).toBeCloseTo(0, 6);
  });
});

describe('impliedVolatility', () => {
  it.each([
    [70, 0.08],
    [95, 0.5],
    [100, 1],
    [118, 1.5],
    [130, 2],
  ])('gives back the volatility a price was made with (K %d, T %d)', (strike, maturity) => {
    const sigma = marketVolatility(strike, maturity);

    expect(impliedVolatility(optionPrice(strike, maturity, sigma), strike, maturity)).toBeCloseTo(
      sigma,
      8,
    );
  });
});

describe('marketVolatility', () => {
  it('smiles: higher on far strikes than at the money, most at short maturities', () => {
    const shortAtMoney = marketVolatility(100, 0.25);
    expect(marketVolatility(75, 0.25)).toBeGreaterThan(shortAtMoney);
    expect(marketVolatility(125, 0.25)).toBeGreaterThan(shortAtMoney);
    expect(marketVolatility(75, 0.25) - shortAtMoney).toBeGreaterThan(
      marketVolatility(75, 2) - marketVolatility(100, 2),
    );
  });

  it('leans to the downside, and rises with time at the money', () => {
    expect(marketVolatility(90, 1)).toBeGreaterThan(marketVolatility(110, 1));
    expect(marketVolatility(100, 2)).toBeGreaterThan(marketVolatility(100, 0.25));
  });
});
