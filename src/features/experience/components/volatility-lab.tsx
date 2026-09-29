import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, type LucideIcon } from 'lucide-react';
import { useId } from 'react';

import { CycleRace } from '@/features/experience/components/cycle-race';
import { useVolatilitySurface } from '@/features/experience/hooks/use-volatility-surface';
import { type CycleRaceContent } from '@/features/experience/types/cycle-race';
import {
  type SurfaceTurn,
  type VolatilityLabContent,
} from '@/features/experience/types/volatility-lab';
import { VIRIDIS_GRADIENT } from '@/features/experience/utils/viridis';
import { cn } from '@/lib/cn';

type VolatilityLabProps = { lab: VolatilityLabContent; race: CycleRaceContent };

const TURN_BUTTONS: readonly { turn: SurfaceTurn; Icon: LucideIcon }[] = [
  { turn: 'left', Icon: ArrowLeft },
  { turn: 'right', Icon: ArrowRight },
  { turn: 'up', Icon: ArrowUp },
  { turn: 'down', Icon: ArrowDown },
];

// The IT-Finance lab (ADR 0036): the implied volatility surface William's calculation
// produces, solved again in the visitor's browser, explained beside it, and the race of the
// two cycles under it. Dark in both themes: a chart's colours read best on it. Lays itself
// out from its container's width: the surface across the top, then its words, in a column;
// side by side from 64rem. The canvas always fills its box, the drawing fits the canvas.
export function VolatilityLab({ lab, race }: VolatilityLabProps) {
  const { controlsRef, canvasRef, milliseconds, reading } = useVolatilitySurface(lab.axes);
  const headingId = useId();
  const descriptionId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="@container overflow-hidden rounded-lg bg-surface text-fg scheme-dark shadow-card"
    >
      <div className="grid @5xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* The canvas is only drawn: the figure's description says what it shows, and its
            buttons (or the arrow keys, once one has the focus) turn it. */}
        <figure
          aria-label={lab.figure}
          aria-describedby={descriptionId}
          className="relative flex flex-col"
        >
          <p id={descriptionId} className="sr-only">
            {lab.description}
          </p>
          <div className="relative aspect-4/3 @xl:aspect-16/10 @5xl:aspect-auto @5xl:min-h-112 @5xl:flex-1">
            {/* The surface's colours come from the tokens set here (text and border colours),
                read by the drawing: it follows the theme without a colour of its own. */}
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 block size-full cursor-grab touch-pan-y border-t-border-input border-r-fg border-b-border border-l-surface-raised font-sans text-fg-muted active:cursor-grabbing"
            />
            {/* What the pointer reads, for the eyes: the figure's description says the rest. */}
            <p
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute top-4 left-4 flex flex-col rounded-md border border-border bg-canvas px-4 py-3 transition-opacity duration-150',
                reading === null ? 'opacity-0' : 'opacity-100',
              )}
            >
              <span className="text-h3 font-semibold">
                {reading === null ? '' : lab.readout.sigma(reading.sigma)}
              </span>
              <span className="text-small text-fg-muted">
                {reading === null ? '' : lab.readout.strike(reading.strike)}
              </span>
              <span className="text-small text-fg-muted">
                {reading === null ? '' : lab.readout.maturity(reading.maturity)}
              </span>
            </p>
          </div>
          <fieldset
            ref={controlsRef}
            className="flex justify-end gap-1 px-4 pb-4 @xl:absolute @xl:right-4 @xl:bottom-4 @xl:p-0"
          >
            <legend className="sr-only">{lab.turn.legend}</legend>
            {TURN_BUTTONS.map(({ turn, Icon }) => (
              <button
                key={turn}
                type="button"
                data-turn={turn}
                className="inline-grid size-11 place-items-center rounded-full border border-border bg-canvas text-fg transition-colors duration-150 hover:bg-surface-raised"
              >
                <Icon aria-hidden="true" focusable="false" className="size-4" strokeWidth={2} />
                <span className="sr-only">{lab.turn[turn]}</span>
              </button>
            ))}
          </fieldset>
        </figure>
        <div className="flex flex-col gap-5 border-t border-border p-6 @xl:p-8 @5xl:border-t-0 @5xl:border-l">
          <p className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
            {lab.overline}
          </p>
          <h4 id={headingId} className="-mt-2 text-h2 font-semibold tracking-tight">
            {lab.title}
          </h4>
          <p className="text-fg-muted">{lab.explanation}</p>
          <p>
            {lab.measure.solved}
            {milliseconds === null ? null : (
              <span className="font-semibold text-accent-fg">
                {lab.measure.duration(milliseconds)}
              </span>
            )}
            {lab.measure.where}
          </p>
          <p className="flex items-center gap-3 text-small text-fg-muted tabular-nums">
            <span>{lab.legend.low}</span>
            <span
              aria-hidden="true"
              style={{ backgroundImage: VIRIDIS_GRADIENT }}
              className="h-1.5 flex-1 rounded-full"
            />
            <span>{lab.legend.high}</span>
          </p>
          <p className="mt-auto text-small text-fg-muted">{lab.hint}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <CycleRace race={race} />
      </div>
    </section>
  );
}
