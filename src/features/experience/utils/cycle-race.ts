import { type CycleTimes } from '@/features/experience/types/cycle-race';

// The race's scale: a minute of the real cycle lasts 20 ms, so an hour lasts 1.2 s and the
// old cycle of ten hours, 12 s. The new one, five minutes, lasts a tenth of a second.
const RACE_MS_PER_MINUTE = 20;

export type RaceFrame = {
  // How far each version's current cycle has gone, from 0 to 1. The new version's bar
  // stays full once its first cycle is done: its next ones are counted, not redrawn, since
  // a bar refilling ten times a second would flash.
  beforeShare: number;
  afterShare: number;
  afterCycles: number;
  // How long the old version's cycle has been running.
  clock: { hours: number; minutes: number };
  isFinished: boolean;
};

// The real minutes the race has covered `elapsedMs` after its start. Time moves on one new
// cycle at a time, so each step completes one more cycle of the new version; it stops as
// the old version completes its first.
export function raceMinutes(
  elapsedMs: number,
  { beforeMinutes, afterMinutes }: CycleTimes,
): number {
  const steps = Math.floor(elapsedMs / (RACE_MS_PER_MINUTE * afterMinutes));
  return Math.min(beforeMinutes, Math.max(0, steps) * afterMinutes);
}

export function raceFrame(minutes: number, { beforeMinutes, afterMinutes }: CycleTimes): RaceFrame {
  const afterCycles = Math.floor(minutes / afterMinutes);
  return {
    beforeShare: minutes / beforeMinutes,
    afterShare: afterCycles > 0 ? 1 : minutes / afterMinutes,
    afterCycles,
    clock: { hours: Math.floor(minutes / 60), minutes: minutes % 60 },
    isFinished: minutes >= beforeMinutes,
  };
}
