import { Pause, Play } from 'lucide-react';

import { useMarqueePause } from '@/features/hero/hooks/use-marquee-pause';

type TechMarqueeProps = { technologies: readonly string[] };

type BandListProps = { technologies: readonly string[] };

// Each item carries its trailing slash, so the seam between the two copies looks like any
// other gap. The slash is not read out; standing still (reduced motion), the last is hidden.
function BandItems({ technologies }: BandListProps) {
  return technologies.map((technology) => (
    <li key={technology} className="group flex items-center gap-8">
      {technology}
      <span aria-hidden="true" className="font-normal motion-reduce:group-last:hidden">
        /
      </span>
    </li>
  ));
}

// A tape across the page, like the band of the reference mockup. The list is rendered
// twice so that sliding by half its width loops without a seam; the copy is hidden from
// assistive tech. With reduced motion it stands still and wraps, and the button goes.
export function TechMarquee({ technologies }: TechMarqueeProps) {
  const { isPaused, togglePause } = useMarqueePause();

  return (
    <div className="flex flex-col items-end gap-2">
      <div
        data-marquee
        data-paused={isPaused ? '' : undefined}
        className="w-full -rotate-2 overflow-hidden bg-accent py-3 font-display text-h3 font-semibold text-on-accent"
      >
        <div className="flex w-max marquee-track motion-reduce:w-full motion-reduce:justify-center">
          <ul
            aria-label="Technologies"
            className="flex shrink-0 items-center gap-8 pe-8 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-gutter"
          >
            <BandItems technologies={technologies} />
          </ul>
          <ul
            aria-hidden="true"
            className="flex shrink-0 items-center gap-8 pe-8 motion-reduce:hidden"
          >
            <BandItems technologies={technologies} />
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={togglePause}
        className="me-gutter inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-small font-semibold text-fg-muted hover:text-fg motion-reduce:hidden"
      >
        {isPaused ? (
          <Play aria-hidden="true" focusable="false" className="size-4" strokeWidth={1.75} />
        ) : (
          <Pause aria-hidden="true" focusable="false" className="size-4" strokeWidth={1.75} />
        )}
        {isPaused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}
      </button>
    </div>
  );
}
