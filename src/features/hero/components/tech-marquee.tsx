import { Pause, Play } from 'lucide-react';

import { useMarqueePause } from '@/features/hero/hooks/use-marquee-pause';

type TechMarqueeProps = { technologies: readonly string[] };

type BandListProps = { technologies: readonly string[] };

// Each item carries its trailing dot, so the seam between the two copies looks like any
// other gap. The dot is decoration; standing still (reduced motion), the last is hidden.
function BandItems({ technologies }: BandListProps) {
  return technologies.map((technology) => (
    <li key={technology} className="group flex items-center gap-8">
      {technology}
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-accent motion-reduce:group-last:hidden"
      />
    </li>
  ));
}

// The horizon line of the hero: a quiet strip across the bottom of the first screen, on a
// solid background so no line of the surface ever runs under its text. The list is
// rendered twice so that sliding by half its width loops without a seam; the copy is
// hidden from assistive tech. It pauses on hover and with its button (WCAG 2.2.2); with
// reduced motion it stands still and wraps, and the button goes.
export function TechMarquee({ technologies }: TechMarqueeProps) {
  const { isPaused, togglePause } = useMarqueePause();

  return (
    <div className="flex items-stretch border-y border-border bg-canvas">
      <p
        aria-hidden="true"
        className="hidden shrink-0 items-center border-e border-border px-gutter text-small font-semibold tracking-[0.2em] text-fg-subtle uppercase sm:flex"
      >
        Stack
      </p>
      <div
        data-marquee
        data-paused={isPaused ? '' : undefined}
        className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:[mask-image:none]"
      >
        <div className="flex w-max marquee-track motion-reduce:w-full">
          <ul
            aria-label="Technologies"
            className="flex shrink-0 items-center gap-8 py-4 pe-8 font-display text-lead font-medium text-fg-muted motion-reduce:flex-wrap motion-reduce:px-gutter"
          >
            <BandItems technologies={technologies} />
          </ul>
          <ul
            aria-hidden="true"
            className="flex shrink-0 items-center gap-8 py-4 pe-8 font-display text-lead font-medium text-fg-muted motion-reduce:hidden"
          >
            <BandItems technologies={technologies} />
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={togglePause}
        className="inline-grid w-14 shrink-0 place-items-center border-s border-border text-fg-muted transition-colors duration-150 hover:bg-surface-raised hover:text-fg motion-reduce:hidden"
      >
        {isPaused ? (
          <Play aria-hidden="true" focusable="false" className="size-5" strokeWidth={1.75} />
        ) : (
          <Pause aria-hidden="true" focusable="false" className="size-5" strokeWidth={1.75} />
        )}
        <span className="sr-only">
          {isPaused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}
        </span>
      </button>
    </div>
  );
}
