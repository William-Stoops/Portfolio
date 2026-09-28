// One cycle of the implied volatility calculation, before and after William redesigned its
// data structure, in minutes: the CV's ten hours, then five minutes.
export type CycleTimes = { beforeMinutes: number; afterMinutes: number };

type Lane = { name: string; pace: string };

// The two cycles raced to scale (ADR 0032), with their words in the page's language.
export type CycleRaceContent = {
  times: CycleTimes;
  overline: string;
  title: string;
  scale: string;
  lanes: Readonly<Record<'before' | 'after', Lane>>;
  // Said before the old version's clock.
  elapsed: string;
  cycles: (count: number) => string;
  start: string;
  restart: string;
  result: (laps: number) => string;
};
