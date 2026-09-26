import { type ReactNode } from 'react';

import { FlightLog } from '@/components/layout/flight-log';
import { FlightPath } from '@/components/layout/flight-path';
import { PageSection } from '@/components/layout/page-section';
import { InkText } from '@/components/ui/ink-text';
import { JOURNEY_ANCHORS, SECTION_IDS } from '@/config/paths';
import { formatSectionNumber } from '@/utils/section-number';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { EXPERIENCES } from '@/features/experience/data/experiences';
import { JOURNEY_STOPS } from '@/features/journey/data/journey-stops';
import { type JourneyStop } from '@/features/journey/types/journey-stop';
import { KoreaChapter } from '@/features/korea/components/korea-chapter';
import { ReturnStage } from '@/features/korea/components/return-stage';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content';
import { ProjectCard } from '@/features/projects/components/project-card';
import { PROJECTS } from '@/features/projects/data/projects';

// The roles, most recent first in their data; each is told at its year below.
const [IT_FINANCE, INTM, STRATTT] = EXPERIENCES;
const [STAXX] = PROJECTS;

// What each year of the journey holds: its note, then the cards that tell the year (the
// roles, the year in Seoul, STAXX). Composing features belongs to the route.
function journeyContent(id: string, note: string | undefined): ReactNode {
  const noteParagraph = note === undefined ? null : <InkText text={note} />;
  switch (id) {
    case 'annee-2022': {
      return <ExperienceCard experience={STRATTT} />;
    }
    case 'annee-2023': {
      return (
        <>
          {noteParagraph}
          <ExperienceCard experience={INTM} />
        </>
      );
    }
    case JOURNEY_ANCHORS.korea: {
      return <KoreaChapter content={KOREA_CONTENT} />;
    }
    case 'annee-2025': {
      return (
        <>
          <ReturnStage content={KOREA_CONTENT} />
          {noteParagraph}
          <ExperienceCard experience={IT_FINANCE} />
          <div id={JOURNEY_ANCHORS.projects} className="@container">
            <ProjectCard project={STAXX} />
          </div>
        </>
      );
    }
    default: {
      return noteParagraph;
    }
  }
}

// Beside the rail, where the reader is: the section, then each year.
const WAYPOINTS = [
  {
    id: SECTION_IDS.experience,
    value: formatSectionNumber(SECTION_IDS.experience) ?? '',
    label: 'Parcours',
  },
  ...JOURNEY_STOPS.map(({ id, year, label }) => ({ id, value: String(year), label })),
];

// The thread of the page: the years at Epitech, from 2021 to the promo 2026, each stop
// holding the cards that tell it. The only section on the flight path: the only story.
export function HomeJourney() {
  return (
    <FlightPath waypoints={WAYPOINTS}>
      <PageSection id={SECTION_IDS.experience} title="Parcours" hasListedStops onPath>
        <FlightLog
          stops={JOURNEY_STOPS.map(({ id, year, label, title, note }: JourneyStop) => ({
            id,
            overline: `${String(year)} · ${label}`,
            filigree: String(year),
            title,
            content: journeyContent(id, note),
          }))}
        />
      </PageSection>
    </FlightPath>
  );
}
