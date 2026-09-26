import { type AboutContent } from '@/features/about/types/about-content';

type MetricVisualProps = { visual: AboutContent['metrics'][number]['visual'] };

// Heights of the podium steps, second / first / third, as a share of the drawing.
const PODIUM_STEPS = [
  { place: 2, className: 'h-3/5 bg-border' },
  { place: 1, className: 'h-full bg-accent' },
  { place: 3, className: 'h-2/5 bg-border' },
] as const;

// The figure drawn from its own numbers, animated as it scrolls into view. The number and
// its label already say it all: the drawing is hidden from assistive tech.
export function MetricVisual({ visual }: MetricVisualProps) {
  switch (visual.kind) {
    case 'reduction': {
      return (
        <div data-visual aria-hidden="true" className="h-2 rounded-full bg-border">
          <div
            style={{ '--shrink-to': visual.remainingShare }}
            className="h-full reveal-shrink-x rounded-full bg-accent"
          />
        </div>
      );
    }
    case 'steps': {
      return (
        <div data-visual aria-hidden="true" className="flex gap-1.5">
          {Array.from({ length: visual.count }, (_, index) => (
            <div
              key={index}
              style={{ '--i': index }}
              className="h-2 flex-1 reveal-pop rounded-full bg-accent"
            />
          ))}
        </div>
      );
    }
    case 'podium': {
      return (
        <div data-visual aria-hidden="true" className="flex h-10 items-end gap-1.5">
          {PODIUM_STEPS.map(({ place, className }, index) => (
            <div
              key={place}
              style={{ '--i': index }}
              className={`w-8 reveal-grow-y rounded-t-sm ${className}`}
            />
          ))}
        </div>
      );
    }
  }
}
