import { Plane } from 'lucide-react';
import { type Ref } from 'react';

import { type KoreaRoute } from '@/features/korea/types/korea-content';

type FlightGlobeProps = {
  ref: Ref<HTMLDivElement>;
  route: KoreaRoute;
  className: string;
};

type GlobePlaceProps = { place: KoreaRoute['origin']; end: 'origin' | 'destination' };

// A place pinned on the globe (by the runtime, which moves it with the globe): a dot, and
// its name under it on the globe's colour, readable over the continents.
function GlobePlace({ place, end }: GlobePlaceProps) {
  return (
    <span data-globe-place={end} className="absolute top-0 left-0 transition-opacity duration-250">
      <span
        className={`absolute rounded-full ${end === 'destination' ? '-top-2 -left-2 size-4 bg-accent' : '-top-1.5 -left-1.5 size-3 bg-border-input'}`}
      />
      <span className="absolute top-3 left-0 flex -translate-x-1/2 items-baseline gap-2 rounded-sm bg-surface px-1.5 whitespace-nowrap">
        {place.korean === undefined ? null : (
          <span lang="ko" className="font-display text-h3 font-semibold text-accent-fg">
            {place.korean}
          </span>
        )}
        <span className="text-small font-semibold tracking-[0.2em] text-fg-muted uppercase">
          {place.name}
        </span>
      </span>
    </span>
  );
}

// The flight over a turning globe, on large screens where the scene is pinned (see
// useFlightGlobe): WebGL draws the continents and the route, the runtime pins the places
// and flies the plane over them. Decoration, like the arc it replaces: the text says where
// the flight goes. The canvas's colour utilities are not styles: the globe reads its tints
// from them, straight from the tokens.
export function FlightGlobe({ ref, route, className }: FlightGlobeProps) {
  return (
    <div
      ref={ref}
      data-flight-globe
      aria-hidden="true"
      className={`relative aspect-square select-none ${className}`}
    >
      {/* The globe's body: the oceans hold no dots, the sphere keeps its outline. */}
      <span
        data-globe-body
        className="absolute inset-[4%] rounded-full border border-border bg-surface"
      />
      <canvas className="absolute inset-0 size-full border-fg-subtle text-accent decoration-border-input" />
      <GlobePlace place={route.origin} end="origin" />
      <GlobePlace place={route.destination} end="destination" />
      <div data-globe-plane data-flight-plane className="absolute top-0 left-0">
        <Plane
          aria-hidden="true"
          strokeWidth={1.75}
          className="absolute -top-5 -left-5 size-10 text-accent-fg"
        />
      </div>
    </div>
  );
}
