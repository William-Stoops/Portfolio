import { type ReactNode } from 'react';

import { StopHeader } from '@/components/layout/stop-header';
import { waypointTimeline } from '@/utils/waypoint-timeline';

type FlightLogStop = {
  // The stop's anchor; it also names its timeline (waypointTimeline).
  id: string;
  overline: string;
  isOverlineDecoration?: boolean;
  filigree?: string;
  title: string;
  headingId?: string;
  content: ReactNode;
};

type FlightLogProps = {
  stops: readonly FlightLogStop[];
  size?: 'large' | 'medium';
};

// Stops along the flight path, within a section: the years of the journey, the practices,
// the chapters of the skills. Each stop is watched through the reading line on its own
// timeline, which fills its marker as the plane reaches it and, when the path lists it,
// shows its label beside the rail (FlightPath). What a stop holds comes in from the rail.
// Stops are contiguous (spaced by padding, not gaps): one is always under the line.
export function FlightLog({ stops, size = 'large' }: FlightLogProps) {
  return (
    // Nested in a section's content: the rail is that far back (StopHeader).
    <ol style={{ '--stop-inset': 'var(--content-x)' }} className="flex flex-col">
      {stops.map(({ id, overline, isOverlineDecoration, filigree, title, headingId, content }) => (
        <li
          key={id}
          id={id}
          style={{ '--timeline': waypointTimeline(id) }}
          className="@container relative flex flex-col gap-10 pb-32 chapter-timeline last:pb-0"
        >
          <StopHeader
            level={3}
            {...(headingId === undefined ? {} : { headingId })}
            {...(filigree === undefined ? {} : { filigree })}
            title={title}
            overline={overline}
            isOverlineDecoration={isOverlineDecoration ?? false}
            size={size}
          />
          <div className="flex flex-col gap-10 *:reveal-from-rail">{content}</div>
        </li>
      ))}
    </ol>
  );
}
