import { CYCLE_TIMES } from '@/features/experience/data/cycle-times';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { INTL_LOCALES } from '@/i18n/locales';
import { formatNumber } from '@/utils/format-number';
import { formatTwoDigits } from '@/utils/format-two-digits';

const PLURALS = new Intl.PluralRules(INTL_LOCALES.en);

// Translates the French race (cycle-race.fr.ts), without adding anything.
export const CYCLE_RACE = {
  times: CYCLE_TIMES,
  title: 'One full cycle, to scale',
  scale: '1 hour = 1.2 seconds',
  lanes: {
    before: { name: 'Before the redesign', pace: '10\u202Fh per cycle' },
    after: { name: 'After', pace: '5\u202Fmin per cycle' },
  },
  beforeProgress: (cycles) => `${formatNumber(cycles, 'en')} / 1 cycle`,
  cycles: (count) =>
    `${formatNumber(count, 'en')} ${PLURALS.select(count) === 'one' ? 'cycle' : 'cycles'}`,
  clock: (hours, minutes) => `Simulated time: ${String(hours)} h ${formatTwoDigits(minutes)}`,
  start: 'Run both computations',
  restart: 'Run them again',
  result: (laps) =>
    `While one old cycle completes, the redesigned version runs ${formatNumber(laps, 'en')}: values up to date again.`,
} as const satisfies CycleRaceContent;
