import { CYCLE_TIMES } from '@/features/experience/data/cycle-times';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { INTL_LOCALES } from '@/i18n/locales';
import { formatNumber } from '@/utils/format-number';

const PLURALS = new Intl.PluralRules(INTL_LOCALES.en);

// Translates the French race (cycle-race.fr.ts), without adding anything.
export const CYCLE_RACE = {
  times: CYCLE_TIMES,
  overline: 'Demo to scale',
  title: 'One computing cycle, before and after the redesign',
  scale:
    'The implied volatility calculation runs continuously. Here an hour lasts 1.2 seconds: start both versions at once.',
  lanes: {
    before: { name: 'Before the redesign', pace: '10 h per cycle' },
    after: { name: 'After the redesign', pace: '5 min per cycle' },
  },
  elapsed: 'Computing time elapsed',
  cycles: (count) =>
    `${formatNumber(count, 'en')} ${PLURALS.select(count) === 'one' ? 'cycle' : 'cycles'} completed`,
  start: 'Start the race',
  restart: 'Run it again',
  result: (laps) =>
    `While one old cycle completes, the redesigned version runs ${formatNumber(laps, 'en')}: values up to date again.`,
} as const satisfies CycleRaceContent;
