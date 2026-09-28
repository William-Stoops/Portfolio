import { VOLATILITY_RANGE } from '@/features/experience/data/volatility-range';
import { type VolatilityLabContent } from '@/features/experience/types/volatility-lab';
import { formatNumber } from '@/utils/format-number';

const decimals = (value: number, digits: number): string =>
  formatNumber(value, 'fr', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const percent = (value: number): string => formatNumber(Math.round(value * 100), 'fr');

// The lab of the IT-Finance role (ADR 0036), in the words William validated on 2026-09-28:
// what implied volatility is, the calculation redone in the visitor's browser.
export const VOLATILITY_LAB = {
  overline: 'Le calcul, en miniature',
  title: 'Volatilité implicite',
  explanation:
    'Le prix d’une option dépend de la volatilité qu’on attend du sous-jacent. La volatilité implicite est celle qui, dans le modèle de Black-Scholes, redonne le prix observé : une par prix d’exercice et par échéance. Ensemble, elles forment cette surface.',
  legend: {
    low: `σ ${percent(VOLATILITY_RANGE.low)} %`,
    high: `${percent(VOLATILITY_RANGE.high)} %`,
  },
  hint: 'Glisser ou flèches pour tourner. Survoler pour lire le sourire et la structure par terme.',
  figure: 'Surface de volatilité implicite',
  description:
    'Surface de volatilité implicite en trois dimensions, selon le prix d’exercice et la maturité. Elle forme une vallée : la volatilité est plus basse autour du prix actuel et remonte sur les prix d’exercice éloignés, surtout aux échéances courtes ; avec le temps, la courbe s’aplatit et monte légèrement.',
  axes: {
    strikeTitle: 'Prix d’exercice K',
    maturityTitle: 'Maturité T',
    maturityTicks: [
      { years: 0.25, label: '3 mois' },
      { years: 1, label: '1 an' },
      { years: 2, label: '2 ans' },
    ],
  },
  turn: {
    legend: 'Tourner la surface',
    left: 'Tourner à gauche',
    right: 'Tourner à droite',
    up: 'Incliner vers le haut',
    down: 'Incliner vers le bas',
  },
  readout: {
    sigma: (sigma) => `σ ${decimals(sigma * 100, 1)} %`,
    strike: (strike) => `K ${decimals(strike, 1)}`,
    maturity: (years) =>
      years < 1
        ? `T ${decimals(years * 12, 1)} mois`
        : `T ${decimals(years, 2)} an${years >= 2 ? 's' : ''}`,
  },
} as const satisfies VolatilityLabContent;
