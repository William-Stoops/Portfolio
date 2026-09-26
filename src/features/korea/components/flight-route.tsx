import { Plane } from 'lucide-react';

import { type KoreaContent } from '@/features/korea/types/korea-content';
import { FLIGHT_ARC } from '@/features/korea/utils/flight-arc';
import { VOYAGE_LAYOUT } from '@/features/korea/utils/voyage-layout';

type FlightRouteProps = { route: KoreaContent['route'] };

// France to Seoul: a dotted arc, and a plane that follows it with a short trail, climbing
// then coming down (motion.css, voyage-flight). On a large screen the flag waits at the
// end of the arc: the Seoul marker gives way to it. Decoration: the text says it.
export function FlightRoute({ route }: FlightRouteProps) {
  return (
    <div data-flight-route aria-hidden="true" className="@container pb-12 select-none lg:pb-0">
      <div className="relative aspect-[10/3] flight-timeline">
        <svg viewBox={FLIGHT_ARC.viewBox} className="absolute inset-0 size-full overflow-visible">
          {/* On a large screen the dots stop at the flag; the plane flies on over its field. */}
          {[
            { path: FLIGHT_ARC.path, className: 'lg:hidden' },
            { path: VOYAGE_LAYOUT.arcToFlag, className: 'hidden lg:block' },
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
            r={7}
            className="fill-border-input"
          />
          <circle
            cx={FLIGHT_ARC.end.x}
            cy={FLIGHT_ARC.end.y}
            r={9}
            className="fill-accent lg:hidden"
          />
        </svg>
        <div
          style={{ top: FLIGHT_ARC.pivotTop, '--arc-half-angle': FLIGHT_ARC.halfAngle }}
          className="absolute left-1/2 size-0 voyage-flight"
        >
          <div
            style={{ top: FLIGHT_ARC.planeTop }}
            className="absolute -left-5 size-10 voyage-altitude"
          >
            {/* A contrail, fading out behind the plane: it turns with the arm, along the arc. */}
            <span className="absolute top-1/2 right-1/2 h-0.5 w-24 -translate-y-1/2 rounded-full bg-linear-to-l from-accent to-transparent" />
            {/* The icon's nose points up and to the right: a quarter turn back faces east. */}
            <Plane
              aria-hidden="true"
              strokeWidth={1.75}
              className="relative size-full rotate-45 text-accent-fg"
            />
          </div>
        </div>
        <span
          style={{ left: FLIGHT_ARC.startLeft, top: FLIGHT_ARC.labelTop }}
          className="absolute -translate-x-1/2 text-small font-semibold tracking-[0.2em] text-fg-muted uppercase"
        >
          {route.from}
        </span>
        <span
          style={{ left: FLIGHT_ARC.endLeft, top: FLIGHT_ARC.labelTop }}
          className="absolute flex -translate-x-1/2 items-baseline gap-2 whitespace-nowrap lg:hidden"
        >
          <span lang="ko" className="font-display text-h3 font-semibold text-accent-fg">
            {route.to.korean}
          </span>
          <span className="text-small font-semibold tracking-[0.2em] text-fg-muted uppercase">
            {route.to.french}
          </span>
        </span>
      </div>
    </div>
  );
}
