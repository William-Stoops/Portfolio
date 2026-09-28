import { ResponsiveImage } from '@/components/ui/responsive-image';
import { type StagePhoto } from '@/features/projects/types/project';
import { odometerStrips } from '@/features/projects/utils/odometer';
import { buildSeatMap, seatDots, seatsByTick } from '@/features/projects/utils/seat-map';

type SummitSceneProps = { photo: StagePhoto };

// The counter ticks, and a group of seats is taken, every ten people.
const SEATS_PER_TICK = 10;
// The study's width: the whole content column once the page reaches its widest. The
// spotlights ask for the same size, so the browser picks the same file once for all three.
const PHOTO_SIZES = '(min-width: 72rem) 67rem, 94vw';
const SPOT_CLASS_NAMES = ['summit-spot-a', 'summit-spot-b'] as const;

// The Epitech Summit as a scene (ADR 0028): the room fills, one dot per person, while a
// counter ticks up to the audience; two follow spots search the dark stage and meet on
// the winner; then the lights come up on the photo. Pinned on a large screen (motion.css,
// summit-*, on --summit); on a small one only the room fills, as it goes by. Still, the
// room is full, the counter at its count and the photo lit. The photo is read once: the
// spotlights show silent copies, and the room, decoration, repeats the figures.
export function SummitScene({ photo }: SummitSceneProps) {
  const room = buildSeatMap(photo.audience.count);
  const ticks = seatsByTick(room, SEATS_PER_TICK);

  return (
    <div style={{ '--scene-timeline': '--summit' }} className="scene-track">
      <div className="scene-stage flex flex-col">
        <div className="flex w-full flex-col gap-6 pinned:mx-auto pinned:w-[min(100%,calc((100dvh-9rem)*1.13))]">
          <figure className="relative reveal-expand">
            <div
              data-summit-stage
              style={{ '--spot-x': photo.spotlight.x, '--spot-y': photo.spotlight.y }}
              className="[container-type:size] relative aspect-[4/5] overflow-clip rounded-lg sm:aspect-[3/2] @4xl:aspect-video pinned:aspect-video"
            >
              <ResponsiveImage
                picture={photo.picture}
                alt={photo.alt}
                sizes={PHOTO_SIZES}
                loading="lazy"
                // On a narrow frame, centred on William and the trophy rather than the group.
                className="block size-full object-cover object-[35%_20%] sm:object-[50%_20%]"
              />
              {/* The dark of the room, until the lights come up on the winners. */}
              <span
                data-summit-light
                aria-hidden="true"
                className="absolute inset-0 summit-veil bg-canvas scheme-dark"
              />
              {SPOT_CLASS_NAMES.map((spotClassName) => (
                <span
                  key={spotClassName}
                  data-summit-light
                  aria-hidden="true"
                  className={`summit-spot ${spotClassName}`}
                >
                  <ResponsiveImage
                    picture={photo.picture}
                    alt=""
                    sizes={PHOTO_SIZES}
                    loading="lazy"
                    className="summit-spot-photo object-cover object-[50%_20%]"
                  />
                </span>
              ))}
            </div>
            {/* In a notch cut into the photo, on the page's own background: its contrast
                never depends on the picture, lit or not. */}
            <figcaption className="absolute start-0 bottom-0 flex flex-col gap-1 rounded-se-lg bg-canvas pe-6 pt-4 sm:pe-10 sm:pt-5">
              <span className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
                {photo.place}
              </span>
              <span className="font-display text-h3 font-semibold">{photo.caption}</span>
            </figcaption>
          </figure>

          <div
            data-summit-room
            aria-hidden="true"
            className="flex flex-col gap-4 select-none summit-room sm:flex-row sm:items-end sm:gap-8"
          >
            <p className="flex shrink-0 flex-col gap-1">
              <span className="flex font-display text-h1 leading-none font-bold tabular-nums">
                {odometerStrips(photo.audience.count, SEATS_PER_TICK).map(({ place, digits }) => (
                  <span key={place} className="h-[1em] overflow-clip">
                    <span
                      data-digits
                      style={{ '--steps': digits.length - 1 }}
                      className="block summit-digits whitespace-pre-line"
                    >
                      {digits.join('\n')}
                    </span>
                  </span>
                ))}
              </span>
              <span className="text-small text-fg-muted">{photo.audience.label}</span>
            </p>
            <svg
              viewBox={room.viewBox}
              fill="none"
              strokeLinecap="round"
              strokeWidth={room.radius * 2}
              className="w-full min-w-0 flex-1 overflow-visible"
            >
              <path data-seats="empty" d={seatDots(room.seats)} className="stroke-border" />
              {ticks.map(({ tick, path }) => (
                <path
                  key={tick}
                  data-seats="taken"
                  d={path}
                  style={{ '--tick': tick, '--ticks': ticks.length }}
                  className="summit-seats stroke-accent"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
