import { Play, RotateCcw } from 'lucide-react';
import { type ReactNode, useId } from 'react';

import { Button } from '@/components/ui/button';
import { useCycleRace } from '@/features/experience/hooks/use-cycle-race';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import { cn } from '@/lib/cn';

type CycleRaceProps = { race: CycleRaceContent };

const ICON_CLASS_NAME = 'size-5';

// The CV's key figure made visible, under the lab's surface: one cycle of the calculation
// before the redesign and one after, raced to scale at the visitor's request
// (useCycleRace). The old bar crawls while the new one is done at once and counts its
// cycles; the result is shown and said. Lays itself out from the lab's width.
export function CycleRace({ race }: CycleRaceProps) {
  const { phase, frame, laps, start } = useCycleRace(race.times);
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5 p-6 @xl:p-8">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h5 id={headingId} className="text-h3 font-semibold">
          {race.title}
        </h5>
        <p className="text-small text-fg-muted">{race.scale}</p>
      </header>

      <dl className="flex flex-col gap-4">
        <RaceLane
          name={race.lanes.before.name}
          pace={race.lanes.before.pace}
          share={frame.beforeShare}
        >
          {race.beforeProgress(frame.isFinished ? 1 : 0)}
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
        <Button type="button" variant="secondary" onClick={start}>
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
        <p className="text-fg-muted tabular-nums">
          {race.clock(frame.clock.hours, frame.clock.minutes)}
        </p>
      </div>
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

// One version on its lane: its name and pace, then its bar (for the eyes only, the words
// beside it say where it stands). The bar grows with a transform, on the compositor, over
// the tenth of a second between two steps of the race.
function RaceLane({ name, pace, share, isAhead = false, children }: RaceLaneProps) {
  return (
    <div className="flex flex-col gap-2 @xl:grid @xl:grid-cols-[11rem_minmax(0,1fr)] @xl:items-center @xl:gap-6">
      <dt>
        <span className="block">{name}</span>
        <span className="block text-small text-fg-muted">{pace}</span>
      </dt>
      <dd className="flex items-center gap-5">
        <div
          aria-hidden="true"
          className="h-2 flex-1 overflow-hidden rounded-full bg-surface-raised"
        >
          <div
            style={{ '--share': share }}
            className={cn(
              'h-full origin-left scale-x-(--share) rounded-full transition-[scale] duration-100 ease-linear',
              isAhead ? 'bg-accent' : 'bg-fg-muted',
            )}
          />
        </div>
        <span className="min-w-24 text-end font-semibold whitespace-nowrap text-fg tabular-nums">
          {children}
        </span>
      </dd>
    </div>
  );
}
