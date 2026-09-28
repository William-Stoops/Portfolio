import { Play, RotateCcw } from 'lucide-react';
import { type ReactNode, useId } from 'react';

import { Button } from '@/components/ui/button';
import { useCycleRace } from '@/features/experience/hooks/use-cycle-race';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { cn } from '@/lib/cn';
import { formatTwoDigits } from '@/utils/format-two-digits';

type CycleRaceProps = { race: CycleRaceContent };

const ICON_CLASS_NAME = 'size-5';

// The CV's key figure made visible: one cycle of the calculation before the redesign and
// one after, raced to scale at the visitor's request (useCycleRace). The old bar crawls
// while the new one is done at once and counts its cycles; the result is shown and said.
// Placed under the IT-Finance role, whose second highlight it illustrates.
export function CycleRace({ race }: CycleRaceProps) {
  const { phase, frame, laps, start } = useCycleRace(race.times);
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      data-pointer
      className="pointer-spotlight flex flex-col gap-6 rounded-lg border border-border bg-surface p-6"
    >
      <header className="flex flex-col gap-2">
        <p className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
          {race.overline}
        </p>
        <h4 id={headingId} className="text-h3 font-semibold">
          {race.title}
        </h4>
        <p className="max-w-prose text-fg-muted">{race.scale}</p>
      </header>

      <dl className="flex flex-col gap-5">
        <RaceLane
          name={race.lanes.before.name}
          pace={race.lanes.before.pace}
          share={frame.beforeShare}
        >
          <span className="sr-only">{race.elapsed} </span>
          {formatTwoDigits(frame.clock.hours)}:{formatTwoDigits(frame.clock.minutes)}
        </RaceLane>
        <RaceLane
          name={race.lanes.after.name}
          pace={race.lanes.after.pace}
          share={frame.afterShare}
          isAhead
        >
          {race.cycles(frame.afterCycles)}
        </RaceLane>
      </dl>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="button" variant="primary" onClick={start}>
          {phase === 'ready' ? (
            <Play
              aria-hidden="true"
              focusable="false"
              strokeWidth={1.75}
              className={ICON_CLASS_NAME}
            />
          ) : (
            <RotateCcw
              aria-hidden="true"
              focusable="false"
              strokeWidth={1.75}
              className={ICON_CLASS_NAME}
            />
          )}
          {phase === 'ready' ? race.start : race.restart}
        </Button>
        {/* The result takes its place from the start (an invisible copy under it), so the
            page does not move when it appears, twelve seconds after the click. aria-live is
            implicit on <output>, but not every screen reader honours it. */}
        <div className="grid max-w-prose">
          <p aria-hidden="true" className="invisible col-start-1 row-start-1 font-semibold">
            {race.result(laps)}
          </p>
          <output aria-live="polite" className="col-start-1 row-start-1 font-semibold text-fg">
            {frame.isFinished ? race.result(laps) : ''}
          </output>
        </div>
      </div>
    </section>
  );
}

type RaceLaneProps = {
  name: string;
  pace: string;
  // How far the version's current cycle has gone, from 0 to 1.
  share: number;
  // The redesigned version, in the accent; the old one stays grey.
  isAhead?: boolean;
  // Where the version stands, in words.
  children: ReactNode;
};

// One version on its lane: its name and pace, then its bar (for the eyes only, the
// words beside it say where it stands). The bar grows with a transform, on the
// compositor, over the tenth of a second between two steps of the race.
function RaceLane({ name, pace, share, isAhead = false, children }: RaceLaneProps) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="text-small font-semibold tracking-[0.2em] text-fg-muted uppercase">
        {name} <span className="font-normal tracking-normal normal-case">· {pace}</span>
      </dt>
      <dd className="flex items-center gap-4">
        <div aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div
            style={{ '--share': share }}
            className={cn(
              'h-full origin-left scale-x-(--share) rounded-full transition-[scale] duration-100 ease-linear',
              isAhead ? 'bg-accent' : 'bg-fg-muted',
            )}
          />
        </div>
        <span className="min-w-12 text-end font-display font-semibold whitespace-nowrap text-fg tabular-nums">
          {children}
        </span>
      </dd>
    </div>
  );
}
