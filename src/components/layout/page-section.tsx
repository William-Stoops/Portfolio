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
  // The journey opens straight on its first year: its title is left to assistive tech,
  // the menu and the years on the rail already saying where the reader is.
  isTitleHidden?: boolean;
  children: ReactNode;
};

// Every home page section: a region named by its h2, reachable by its anchor, on the
// shared content column and vertical rhythm, opened like a chapter: its number in filigree,
// its title whole from the first paint (StopHeader). The journey's content starts where the
// flight path says (--content-x), on its first year.
export function PageSection({
  id,
  title,
  lead,
  isTitleHidden = false,
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
        style={waypoint}
        className="relative flex flex-col gap-12 ps-[var(--content-x,0rem)] chapter-timeline"
      >
        {isTitleHidden ? (
          <h2 id={headingId} className="sr-only">
            {title}
          </h2>
        ) : (
          // Positioned, for the filigree.
          <div className="relative isolate flex flex-col gap-5">
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
        )}
        {children}
      </div>
    </section>
  );
}
