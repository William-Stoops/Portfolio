import { type ReactNode } from 'react';

import { FlightRoute } from '@/features/korea/components/flight-route';
import { type KoreaRoute } from '@/features/korea/types/korea-content';
import { SCENE_LAYOUTS } from '@/features/korea/utils/voyage-layout';
import { splitIntoLetters } from '@/utils/split-text';

type Greeting = {
  text: string;
  // Set when the greeting is not French, for screen readers and fonts.
  lang?: string;
  // Its translation, in brackets after it.
  translation?: string;
};

type FlightSceneProps = {
  direction: 'east' | 'west';
  route: KoreaRoute;
  // Names the pinned timeline, so the rail's plane can step away while this one flies.
  timeline: '--voyage' | '--homecoming';
  flag: ReactNode;
  greeting: Greeting;
  // A text for the other end of the scene: facing the greeting, under the origin.
  aside: ReactNode;
};

// A flight told in one scene: the plane crosses a dotted arc, the flag unfurls where it
// lands, then the greeting rises under the flag. On a large screen the scene is pinned while
// its track scrolls by (motion.css, voyage-*, on the timeline it names) and the arc ends on
// the flag: on the right flying east, on the left flying west. On a small one the pieces
// simply follow each other.
export function FlightScene({
  direction,
  route,
  timeline,
  flag,
  greeting,
  aside,
}: FlightSceneProps) {
  const layout = SCENE_LAYOUTS[direction];
  const isEast = direction === 'east';

  return (
    <div style={{ '--scene-timeline': timeline }} className="voyage-track">
      <div className="voyage-stage flex flex-col">
        <div className="@container">
          <div
            style={{
              '--route-left': layout.routeLeft,
              '--route-width': layout.routeWidth,
              '--flag-width': layout.flagWidth,
              '--flag-left': layout.flagLeft,
              '--flag-top': layout.flagTop,
              '--scene-height': layout.sceneHeight,
            }}
            className="relative flex flex-col gap-10 lg:block lg:h-[calc(var(--scene-height)+7rem)]"
          >
            {/* On a large screen, under the origin, facing the greeting. */}
            <div
              className={`lg:absolute lg:bottom-0 lg:max-w-[55%] ${isEast ? 'lg:left-0' : 'lg:right-0 lg:text-end'}`}
            >
              {aside}
            </div>
            <div className="lg:absolute lg:top-0 lg:left-(--route-left) lg:z-10 lg:w-(--route-width)">
              <FlightRoute route={route} direction={direction} />
            </div>
            <div className="flex flex-col gap-6 lg:absolute lg:top-(--flag-top) lg:left-(--flag-left) lg:w-(--flag-width)">
              {flag}
              <p className="flex flex-wrap items-baseline gap-x-3 font-display text-h2 font-semibold">
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
          </div>
        </div>
      </div>
    </div>
  );
}
