import { FlightRoute } from '@/features/korea/components/flight-route';
import { TaegeukFlag } from '@/features/korea/components/taegeuk-flag';
import { type KoreaContent } from '@/features/korea/types/korea-content';
import { VOYAGE_LAYOUT } from '@/features/korea/utils/voyage-layout';
import { splitIntoLetters } from '@/utils/split-text';

type VoyageStageProps = { content: KoreaContent };

// The journey, told in one scene: the year in a sentence, the flight, the flag that
// unfurls where the plane lands, then the greeting. On a large screen the scene is pinned
// while its track scrolls by (motion.css, voyage-*), and the arc ends on the taegeuk;
// on a small one the pieces simply follow each other.
export function VoyageStage({ content }: VoyageStageProps) {
  return (
    <div className="voyage-track">
      <div className="voyage-stage flex flex-col">
        <div className="@container">
          <div
            style={{
              '--route-width': VOYAGE_LAYOUT.routeWidth,
              '--flag-width': VOYAGE_LAYOUT.flagWidth,
              '--flag-left': VOYAGE_LAYOUT.flagLeft,
              '--flag-top': VOYAGE_LAYOUT.flagTop,
              '--scene-height': VOYAGE_LAYOUT.sceneHeight,
            }}
            className="relative flex flex-col gap-10 lg:block lg:h-[calc(var(--scene-height)+7rem)]"
          >
            {/* First on a small screen; on a large one, under France, facing the greeting. */}
            <p className="max-w-3xl text-lead text-fg-muted lg:absolute lg:bottom-0 lg:left-0 lg:max-w-[55%]">
              {content.lead}
            </p>
            <div className="lg:absolute lg:top-0 lg:left-0 lg:z-10 lg:w-(--route-width)">
              <FlightRoute route={content.route} />
            </div>
            <div className="flex flex-col gap-6 lg:absolute lg:top-(--flag-top) lg:left-(--flag-left) lg:w-(--flag-width)">
              <TaegeukFlag />
              <p className="flex flex-wrap items-baseline gap-x-3 font-display text-h2 font-semibold">
                <span lang="ko" className="sr-only">
                  {content.greeting.korean}
                </span>
                {/* Read once above; the letters rise one by one once the flag is up. */}
                <span aria-hidden="true" lang="ko" className="text-accent-fg">
                  {splitIntoLetters(content.greeting.korean).map(({ letters }) =>
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
                <span className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]">
                  <span
                    style={{ '--i': content.greeting.korean.length }}
                    className="inline-block voyage-letter text-h3 font-medium text-fg-subtle"
                  >
                    ({content.greeting.french})
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
