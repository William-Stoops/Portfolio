import { Plane } from 'lucide-react';
import { type ReactNode } from 'react';

import { waypointTimeline } from '@/utils/waypoint-timeline';

type Waypoint = {
  // Anchor of the section or stop the waypoint follows (waypointTimeline).
  id: string;
  // Set large: a section's number, a year.
  value: string;
  label: string;
};

type FlightPathProps = {
  waypoints: readonly Waypoint[];
  children: ReactNode;
};

// The flight path of the story (the journey), the only part of the page told in time. One
// dotted rail runs along it; behind a plane riding the reading line it turns into a solid
// trail, and it lands at the end, today. Beside it, on large screens, a sticky column names
// where the reader is (the section, then each year), each label sliding in and out as its
// waypoint crosses the reading line. The section and its stops set their markers on this
// rail (StopHeader), placed from the variables this path defines (flight-path-layout). The
// plane steps away while a flight scene flies its own. All of it is scroll-driven CSS and
// drawing, hidden from assistive tech.
export function FlightPath({ waypoints, children }: FlightPathProps) {
  return (
    <div
      style={{
        '--scope': [
          ...waypoints.map(({ id }) => waypointTimeline(id)),
          '--voyage',
          '--homecoming',
        ].join(', '),
      }}
      className="relative flight-path-layout"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="relative mx-auto h-full max-w-6xl px-gutter">
          <div className="relative h-full">
            <div className="absolute inset-y-0 start-0 chapter-rail w-44">
              <div className="sticky top-32 h-28">
                {waypoints.map(({ id, value, label }) => (
                  <div
                    key={id}
                    data-waypoint
                    style={{ '--timeline': waypointTimeline(id) }}
                    className="absolute inset-x-0 top-0 stop-label-in"
                  >
                    <div className="flex stop-label-out flex-col gap-3">
                      <p className="font-display text-[clamp(2.75rem,1.5rem+2vw,3.75rem)] leading-none font-bold whitespace-nowrap text-accent-fg tabular-nums">
                        {value}
                      </p>
                      <p className="text-small font-semibold tracking-[0.2em] text-fg-muted uppercase">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              data-flight-rail
              className="absolute inset-y-(--spacing-section) start-[calc(var(--rail-x,0.5rem)-1px)] w-0.5 rail-timeline"
            >
              <div className="absolute inset-0 flight-path" />
              <div className="absolute inset-0 flight-log-fill rounded-full bg-accent" />
              {/* The landing: where the path ends, today. */}
              <span className="absolute -start-[0.6875rem] -bottom-3 size-6 rounded-full border-2 border-accent bg-canvas">
                <span className="absolute inset-1 rounded-full bg-accent" />
              </span>
              {/* The plane rides the tip of the trail, on the reading line. */}
              <div className="absolute inset-0">
                <div
                  style={{ '--away-timeline': '--voyage' }}
                  className="sticky top-[40vh] -ms-[1.1875rem] size-10 -translate-y-1/2 flight-log-plane"
                >
                  <div
                    style={{ '--away-timeline': '--homecoming' }}
                    className="relative size-full flight-log-plane"
                  >
                    <span className="absolute inset-1 rounded-full bg-canvas" />
                    {/* The icon's nose points up and to the right: three eighths of a turn face down. */}
                    <Plane
                      strokeWidth={1.75}
                      className="relative size-full rotate-135 p-1.5 text-accent-fg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
