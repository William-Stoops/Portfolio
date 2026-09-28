import { useEffect, useRef, useState } from 'react';

import { type CycleTimes } from '@/features/experience/types/cycle-race';
import { type RaceFrame, raceFrame, raceMinutes } from '@/features/experience/utils/cycle-race';

type RacePhase = 'ready' | 'running' | 'finished';

// Twice per step of the race (a new cycle every 100 ms): the display keeps up with the
// clock. The clock is read, not counted: a tab in the background slows the timer, never
// the race.
const TICK_MS = 50;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// The race of the two cycles, started by the visitor, to scale (utils/cycle-race.ts).
// With reduced motion there is no race: the button gives the result at once.
export function useCycleRace(times: CycleTimes): {
  phase: RacePhase;
  frame: RaceFrame;
  // How many new cycles fit in one old one: the result.
  laps: number;
  start: () => void;
} {
  const [phase, setPhase] = useState<RacePhase>('ready');
  const [minutes, setMinutes] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearInterval(timer.current);
    },
    [],
  );

  function finish(): void {
    window.clearInterval(timer.current);
    setMinutes(times.beforeMinutes);
    setPhase('finished');
  }

  function start(): void {
    window.clearInterval(timer.current);
    if (window.matchMedia(REDUCED_MOTION).matches) {
      finish();
      return;
    }
    const startedAt = performance.now();
    setMinutes(0);
    setPhase('running');
    timer.current = window.setInterval(() => {
      const covered = raceMinutes(performance.now() - startedAt, times);
      if (covered >= times.beforeMinutes) {
        finish();
      } else {
        setMinutes(covered);
      }
    }, TICK_MS);
  }

  return {
    phase,
    frame: raceFrame(minutes, times),
    laps: times.beforeMinutes / times.afterMinutes,
    start,
  };
}
