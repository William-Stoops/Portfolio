import { CYCLE_TIMES } from '@/features/experience/data/cycle-times';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { INTL_LOCALES } from '@/i18n/locales';
import { formatNumber } from '@/utils/format-number';

const PLURALS = new Intl.PluralRules(INTL_LOCALES.fr);

// The CV's "de 10 heures à 5 minutes, et des valeurs de nouveau à jour", raced to scale
// (ADR 0032): nothing is said that the CV does not say, the scale is stated.
export const CYCLE_RACE = {
  times: CYCLE_TIMES,
  overline: 'Démo à l’échelle',
  title: 'Un cycle de calcul, avant et après la refonte',
  scale:
    'Le calcul de volatilité implicite tourne en continu. Ici, une heure dure 1,2 seconde : lancez les deux versions en même temps.',
  lanes: {
    before: { name: 'Avant la refonte', pace: '10 h par cycle' },
    after: { name: 'Après la refonte', pace: '5 min par cycle' },
  },
  elapsed: 'Temps de calcul écoulé',
  cycles: (count) =>
    `${formatNumber(count, 'fr')} ${PLURALS.select(count) === 'one' ? 'cycle terminé' : 'cycles terminés'}`,
  start: 'Lancer la course',
  restart: 'Relancer la course',
  result: (laps) =>
    `Pendant qu’un cycle d’avant s’achève, la version refondue en boucle ${formatNumber(laps, 'fr')} : des valeurs de nouveau à jour.`,
} as const satisfies CycleRaceContent;
