import { SURFACE_GRID } from '@/features/experience/data/surface-grid';
import { VOLATILITY_RANGE } from '@/features/experience/data/volatility-range';
import { type VolatilityLabContent } from '@/features/experience/types/volatility-lab';
import { formatNumber } from '@/utils/format-number';

const decimals = (value: number, digits: number): string =>
  formatNumber(value, 'en', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const percent = (value: number): string => formatNumber(Math.round(value * 100), 'en');

// Translates the French lab (volatility-lab.fr.ts), without adding anything.
export const VOLATILITY_LAB = {
  overline: 'The computation, in miniature',
  title: 'Implied volatility',
  explanation:
    'An option’s price depends on the volatility expected of the underlying. Implied volatility is the one that, in the Black-Scholes model, gives back the observed price: one per strike and maturity. Together, they form this surface.',
  measure: {
    solved: `${formatNumber(SURFACE_GRID.strikes * SURFACE_GRID.maturities, 'en')} volatilities found by Newton-Raphson`,
    duration: (milliseconds) => ` in ${decimals(milliseconds, 2)} ms`,
    where: ', in your browser. Simulated prices.',
  },
  legend: {
    low: `σ ${percent(VOLATILITY_RANGE.low)}%`,
    high: `${percent(VOLATILITY_RANGE.high)}%`,
  },
  hint: 'Drag or use the arrow keys to turn. Hover to read the smile and the term structure.',
  figure: 'Implied volatility surface',
  description:
    'Three-dimensional implied volatility surface, by strike and maturity. It forms a valley: volatility is lowest around the current price and rises on distant strikes, most at short maturities; over time, the curve flattens and rises slightly.',
  axes: {
    strikeTitle: 'Strike K',
    maturityTitle: 'Maturity T',
    maturityTicks: [
      { years: 0.25, label: '3 months' },
      { years: 1, label: '1 year' },
      { years: 2, label: '2 years' },
    ],
  },
  turn: {
    legend: 'Turn the surface',
    left: 'Turn left',
    right: 'Turn right',
    up: 'Tilt up',
    down: 'Tilt down',
  },
  readout: {
    sigma: (sigma) => `σ ${decimals(sigma * 100, 1)}%`,
    strike: (strike) => `K ${decimals(strike, 1)}`,
    maturity: (years) =>
      years < 1
        ? `T ${decimals(years * 12, 1)} months`
        : `T ${decimals(years, 2)} year${years >= 2 ? 's' : ''}`,
  },
} as const satisfies VolatilityLabContent;
