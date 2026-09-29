import { CYCLE_TIMES } from '@/features/experience/data/cycle-times';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { INTL_LOCALES } from '@/i18n/locales';
import { formatNumber } from '@/utils/format-number';
import { formatTwoDigits } from '@/utils/format-two-digits';

const PLURALS = new Intl.PluralRules(INTL_LOCALES.fr);

// The CV's "de 10 heures à 5 minutes, et des valeurs de nouveau à jour", raced to scale
// (ADR 0032): nothing is said that the CV does not say, the scale is stated.
export const CYCLE_RACE = {
  times: CYCLE_TIMES,
  title: 'Un cycle complet, à l’échelle',
  scale: '1 heure = 1,2 seconde',
  lanes: {
    before: { name: 'Avant la refonte', pace: '10\u202Fh par cycle' },
    after: { name: 'Après', pace: '5\u202Fmin par cycle' },
  },
  beforeProgress: (cycles) => `${formatNumber(cycles, 'fr')} / 1 cycle`,
  cycles: (count) =>
    `${formatNumber(count, 'fr')} ${PLURALS.select(count) === 'one' ? 'cycle' : 'cycles'}`,
  clock: (hours, minutes) => `Temps simulé : ${String(hours)} h ${formatTwoDigits(minutes)}`,
  start: 'Lancer les deux calculs',
  restart: 'Relancer les deux calculs',
  result: (laps) =>
    `Pendant qu’un cycle d’avant s’achève, la version refondue en boucle ${formatNumber(laps, 'fr')} : des valeurs de nouveau à jour.`,
} as const satisfies CycleRaceContent;
