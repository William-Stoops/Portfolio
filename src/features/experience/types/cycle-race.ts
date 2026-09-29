// One cycle of the implied volatility calculation, before and after William redesigned its
// data structure, in minutes: the CV's ten hours, then five minutes.
export type CycleTimes = { beforeMinutes: number; afterMinutes: number };

type Lane = { name: string; pace: string };

// The two cycles raced to scale (ADR 0032), under the lab's surface, with their words in
// the page's language.
export type CycleRaceContent = {
  times: CycleTimes;
  title: string;
  // The scale, stated beside the title: an hour lasts 1.2 seconds.
  scale: string;
  lanes: Readonly<Record<'before' | 'after', Lane>>;
  // Where the old version stands: its one cycle, done or not.
  beforeProgress: (cycles: number) => string;
  cycles: (count: number) => string;
  // The simulated time, as the old version's cycle runs.
  clock: (hours: number, minutes: number) => string;
  start: string;
  restart: string;
  result: (laps: number) => string;
};
