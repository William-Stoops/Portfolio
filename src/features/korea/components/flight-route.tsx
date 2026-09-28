import { Plane } from 'lucide-react';

import { type KoreaRoute } from '@/features/korea/types/korea-content';
import { FLIGHT_ARC } from '@/features/korea/utils/flight-arc';
import { SCENE_LAYOUTS } from '@/features/korea/utils/voyage-layout';

type FlightRouteProps = { route: KoreaRoute; direction: 'east' | 'west' };

type PlaceLabelProps = { place: KoreaRoute['origin']; left: string; isDestination: boolean };

// On a large screen the flag stands at the destination: its label gives way to it.
function PlaceLabel({ place, left, isDestination }: PlaceLabelProps) {
  return (
    <span
      data-place
      style={{ left, top: FLIGHT_ARC.labelTop }}
      className={`absolute flex -translate-x-1/2 items-baseline gap-2 whitespace-nowrap ${isDestination ? 'lg:hidden' : ''}`}
    >
      {place.korean === undefined ? null : (
        <span lang="ko" className="font-display text-h3 font-semibold text-accent-fg">
          {place.korean}
        </span>
      )}
      <span className="text-small font-semibold tracking-[0.2em] text-fg-muted uppercase">
        {place.name}
      </span>
    </span>
  );
}

// A dotted arc between two places, and a plane that follows it with a short trail,
// climbing then coming down (motion.css, voyage-*). Flying west, the arm turns the other
// way and the plane faces west. On a large screen the dots stop at the destination's flag
// and the plane flies on over it. Decoration: the text says where it goes.
export function FlightRoute({ route, direction }: FlightRouteProps) {
  const isEast = direction === 'east';
  // The origin is where the plane leaves: on the left flying east, on the right flying west.
  const [left, right] = isEast
    ? [route.origin, route.destination]
    : [route.destination, route.origin];

  return (
    <div
      data-flight-route
      data-direction={direction}
      aria-hidden="true"
      className="@container pb-12 select-none lg:pb-0"
    >
      <div className="relative aspect-[10/3] flight-timeline">
        <svg viewBox={FLIGHT_ARC.viewBox} className="absolute inset-0 size-full overflow-visible">
          {[
            { path: FLIGHT_ARC.path, className: 'lg:hidden' },
            { path: SCENE_LAYOUTS[direction].arcToFlag, className: 'hidden lg:block' },
          ].map(({ path, className }) => (
            <path
              key={path}
              d={path}
              fill="none"
              strokeWidth={2}
              strokeDasharray="1 9"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={`stroke-border-input ${className}`}
            />
          ))}
          <circle
            cx={FLIGHT_ARC.start.x}
            cy={FLIGHT_ARC.start.y}
            r={isEast ? 7 : 9}
            className={isEast ? 'fill-border-input' : 'fill-accent lg:hidden'}
          />
          <circle
            cx={FLIGHT_ARC.end.x}
            cy={FLIGHT_ARC.end.y}
            r={isEast ? 9 : 7}
            className={isEast ? 'fill-accent lg:hidden' : 'fill-border-input'}
          />
        </svg>
        <div
          style={{
            top: FLIGHT_ARC.pivotTop,
            '--arc-half-angle': isEast ? FLIGHT_ARC.halfAngle : `-${FLIGHT_ARC.halfAngle}`,
          }}
          className="absolute left-1/2 size-0 voyage-flight"
        >
          <div
            style={{ top: FLIGHT_ARC.planeTop }}
            className="absolute -left-5 size-10 voyage-altitude"
          >
            {/* A contrail, fading out behind the plane: it turns with the arm, along the arc. */}
            <span
              className={`absolute top-1/2 h-0.5 w-24 -translate-y-1/2 rounded-full from-accent to-transparent ${
                isEast ? 'right-1/2 bg-linear-to-l' : 'left-1/2 bg-linear-to-r'
              }`}
            />
            {/* The icon's nose points up and to the right: turned to face east, or west. */}
            <Plane
              aria-hidden="true"
              strokeWidth={1.75}
              className={`relative size-full text-accent-fg ${isEast ? 'rotate-45' : 'rotate-225'}`}
            />
          </div>
        </div>
        <PlaceLabel place={left} left={FLIGHT_ARC.startLeft} isDestination={!isEast} />
        <PlaceLabel place={right} left={FLIGHT_ARC.endLeft} isDestination={isEast} />
      </div>
    </div>
  );
}
