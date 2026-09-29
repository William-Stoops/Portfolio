import { type CycleTimes } from '@/features/experience/types/cycle-race';

// Source: docs/content/cv-source.md, IT-Finance: the implied volatility calculation had
// drifted to ten hours a cycle; after the redesign of its data structure, five minutes.
// Written once, raced in both languages.
export const CYCLE_TIMES = {
  beforeMinutes: 10 * 60,
  afterMinutes: 5,
} as const satisfies CycleTimes;
