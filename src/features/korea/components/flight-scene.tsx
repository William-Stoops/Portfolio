import { type ReactNode } from 'react';

import { FlightGlobe } from '@/features/korea/components/flight-globe';
import { FlightRoute } from '@/features/korea/components/flight-route';
import { useFlightGlobe } from '@/features/korea/hooks/use-flight-globe';
import { type FlightDirection } from '@/features/korea/types/flight-direction';
import { type Greeting, type KoreaRoute } from '@/features/korea/types/korea-content';
import { SCENE_LAYOUTS } from '@/features/korea/utils/voyage-layout';
import { splitIntoLetters } from '@/utils/split-text';

type FlightSceneProps = {
  direction: FlightDirection;
  route: KoreaRoute;
  // Names the pinned timeline, so the rail's plane can step away while this one flies.
  timeline: '--voyage' | '--homecoming';
  flag: ReactNode;
  greeting: Greeting;
  // A text for the other end of the scene: facing the greeting, under the origin.
  aside: ReactNode;
};

type SceneParts = {
  scene: string;
  aside: string;
  route: string;
  landing: string;
  greeting: string;
  globe: string;
};

// The flat arc spans the scene on a large screen, the flag waiting at its landing and the
// aside under the origin; on a small one the pieces follow each other.
const ARC_PARTS: Readonly<Record<FlightDirection, SceneParts>> = {
  east: {
    scene: 'relative flex flex-col gap-10 lg:block lg:h-[calc(var(--scene-height)+7rem)]',
    aside: 'lg:absolute lg:bottom-0 lg:left-0 lg:max-w-[55%]',
    route: 'lg:absolute lg:top-0 lg:left-(--route-left) lg:z-10 lg:w-(--route-width)',
    landing:
      'flex flex-col gap-6 lg:absolute lg:top-(--flag-top) lg:left-(--flag-left) lg:w-(--flag-width)',
    greeting: '',
    globe: 'hidden',
  },
  west: {
    scene: 'relative flex flex-col gap-10 lg:block lg:h-[calc(var(--scene-height)+7rem)]',
    aside: 'lg:absolute lg:right-0 lg:bottom-0 lg:max-w-[55%] lg:text-end',
    route: 'lg:absolute lg:top-0 lg:left-(--route-left) lg:z-10 lg:w-(--route-width)',
    landing:
      'flex flex-col gap-6 lg:absolute lg:top-(--flag-top) lg:left-(--flag-left) lg:w-(--flag-width)',
    greeting: '',
    globe: 'hidden',
  },
};

// With the globe (large, tall screens: see useFlightGlobe), the globe takes one side and,
// facing it, the words of departure, then the flag and the greeting where it lands: on the
// right flying east, on the left flying west, turned towards the globe. The globe zooms in
// as it takes the arc's place (its entrance replays when it stops being hidden).
const GLOBE_PARTS: Readonly<Record<FlightDirection, SceneParts>> = {
  east: {
    scene: 'grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-x-10 gap-y-8',
    aside: 'col-start-2 row-start-1 self-end',
    route: 'hidden',
    landing: 'col-start-2 row-start-2 flex flex-col gap-6 self-start',
    greeting: '',
    globe:
      'col-start-1 row-span-2 row-start-1 w-full max-w-[calc(100dvh-9rem)] enter-zoom justify-self-center',
  },
  west: {
    scene: 'grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-x-10 gap-y-8',
    aside: 'col-start-1 row-start-1 self-end text-end',
    route: 'hidden',
    landing: 'col-start-1 row-start-2 flex flex-col items-end gap-6 self-start',
    greeting: 'justify-end',
    globe:
      'col-start-2 row-span-2 row-start-1 w-full max-w-[calc(100dvh-9rem)] enter-zoom justify-self-center',
  },
};

// A flight told in one scene: the plane crosses a dotted arc, or a turning globe on large
// screens, the flag unfurls where it lands, then the greeting rises under the flag. On a
// large screen the scene is pinned while its track scrolls by (motion.css, voyage-*, on the
// timeline it names). The arc and the globe are both in the page, whichever shows: the
// globe's canvas survives a switch back and forth.
export function FlightScene({
  direction,
  route,
  timeline,
  flag,
  greeting,
  aside,
}: FlightSceneProps) {
  const { trackRef, globeRef, isGlobe } = useFlightGlobe(direction);
  const layout = SCENE_LAYOUTS[direction];
  const parts = (isGlobe ? GLOBE_PARTS : ARC_PARTS)[direction];

  return (
    <div ref={trackRef} style={{ '--scene-timeline': timeline }} className="scene-track">
      <div className="scene-stage flex flex-col">
        <div className="@container">
          <div
            data-globe={isGlobe ? '' : undefined}
            style={{
              '--route-left': layout.routeLeft,
              '--route-width': layout.routeWidth,
              '--flag-width': layout.flagWidth,
              '--flag-left': layout.flagLeft,
              '--flag-top': layout.flagTop,
              '--scene-height': layout.sceneHeight,
            }}
            className={parts.scene}
          >
            {/* Under the origin, facing the greeting; beside the globe, before the flag. */}
            <div className={parts.aside}>{aside}</div>
            <div className={parts.route}>
              <FlightRoute route={route} direction={direction} />
            </div>
            <div className={parts.landing}>
              {flag}
              <p
                className={`flex flex-wrap items-baseline gap-x-3 font-display text-h2 font-semibold ${parts.greeting}`}
              >
                <span lang={greeting.lang} className="sr-only">
                  {greeting.text}
                </span>
                {/* Read once above; the letters rise one by one once the flag is up. */}
                <span aria-hidden="true" lang={greeting.lang} className="text-accent-fg">
                  {splitIntoLetters(greeting.text).map(({ letters }) =>
                    letters.map((letter) => (
                      <span
                        key={letter.index}
                        className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]"
                      >
                        <span
                          style={{ '--i': letter.index }}
                          className="inline-block voyage-letter"
                        >
                          {letter.text}
                        </span>
                      </span>
                    )),
                  )}
                </span>
                {greeting.translation === undefined ? null : (
                  <span className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]">
                    <span
                      style={{ '--i': greeting.text.length }}
                      className="inline-block voyage-letter text-h3 font-medium text-fg-subtle"
                    >
                      ({greeting.translation})
                    </span>
                  </span>
                )}
              </p>
            </div>
            <FlightGlobe ref={globeRef} route={route} className={parts.globe} />
          </div>
        </div>
      </div>
    </div>
  );
}
