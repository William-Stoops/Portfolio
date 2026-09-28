import { type ReactNode } from 'react';

import { StopHeader } from '@/components/layout/stop-header';
import { formatSectionNumber } from '@/utils/section-number';
import { waypointTimeline } from '@/utils/waypoint-timeline';

type PageSectionProps = {
  // Fragment id of the section (see SECTION_IDS); the heading id derives from it.
  id: string;
  title: string;
  // Optional introduction, kept close to the heading.
  lead?: ReactNode;
  // When the section holds stops the flight path lists (the years of the journey), its
  // own waypoint covers its header only, so one label shows at a time beside the rail.
  hasListedStops?: boolean;
  children: ReactNode;
};

// Every home page section: a region named by its h2, reachable by its anchor, on the
// shared content column and vertical rhythm, and a stop of the flight path (FlightPath):
// its header marks the rail, its number is set in filigree and beside the rail, its
// title rises letter by letter (StopHeader). Its content starts where the path says.
export function PageSection({
  id,
  title,
  lead,
  hasListedStops = false,
  children,
}: PageSectionProps) {
  const headingId = `${id}-titre`;
  const sectionNumber = formatSectionNumber(id);
  const waypoint = { '--timeline': waypointTimeline(id) };

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-6xl px-gutter py-section defer-render"
    >
      <div
        style={hasListedStops ? undefined : waypoint}
        className={`relative flex flex-col gap-12 ps-[var(--content-x,0rem)] ${hasListedStops ? '' : 'chapter-timeline'}`}
      >
        <div
          style={hasListedStops ? waypoint : undefined}
          className={`flex flex-col gap-5 ${hasListedStops ? 'chapter-timeline' : ''}`}
        >
          <StopHeader
            level={2}
            headingId={headingId}
            title={title}
            {...(sectionNumber === undefined
              ? {}
              : { overline: sectionNumber, filigree: sectionNumber })}
            isOverlineDecoration
          />
          {lead}
        </div>
        {children}
      </div>
    </section>
  );
}
