import { type ReactNode } from 'react';

import { type SiteContent } from '@/app/content/site-content';
import { useSiteContent } from '@/app/content/site-content-context';
import { FlightLog } from '@/components/layout/flight-log';
import { FlightPath } from '@/components/layout/flight-path';
import { PageSection } from '@/components/layout/page-section';
import { InkText } from '@/components/ui/ink-text';
import { JOURNEY_ANCHORS } from '@/config/paths';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { VolatilityLab } from '@/features/experience/components/volatility-lab';
import { KoreaChapter } from '@/features/korea/components/korea-chapter';
import { ReturnStage } from '@/features/korea/components/return-stage';
import { ProjectCard } from '@/features/projects/components/project-card';
import { useLocale } from '@/i18n/locale-context';
import { type Locale } from '@/i18n/locales';
import { formatSectionNumber } from '@/utils/section-number';

// What each year of the journey holds: its note, then the cards that tell the year (the
// roles, the year in Seoul, STAXX). Chosen by the year, which no language changes;
// composing features belongs to the route.
function journeyContent(
  year: number,
  note: string | undefined,
  content: SiteContent,
  locale: Locale,
): ReactNode {
  const noteParagraph = note === undefined ? null : <InkText text={note} />;
  const [itFinance, intm, strattt] = content.experiences.entries;
  const { labels } = content.experiences;
  switch (year) {
    case 2022: {
      return <ExperienceCard experience={strattt} labels={labels} />;
    }
    case 2023: {
      return (
        <>
          {noteParagraph}
          <ExperienceCard experience={intm} labels={labels} />
        </>
      );
    }
    case 2024: {
      return <KoreaChapter content={content.korea} />;
    }
    case 2025: {
      const [staxx] = content.projects.entries;
      return (
        <>
          <ReturnStage content={content.korea} />
          {noteParagraph}
          <ExperienceCard experience={itFinance} labels={labels} />
          <div className="@container">
            <VolatilityLab lab={content.experiences.lab} race={content.experiences.race} />
          </div>
          <div id={JOURNEY_ANCHORS[locale].projects} className="@container">
            <ProjectCard project={staxx} labels={content.projects.labels} />
          </div>
        </>
      );
    }
    default: {
      return noteParagraph;
    }
  }
}

// The thread of the page: the years at Epitech, from 2021 to the promo 2026, each stop
// holding the cards that tell it. The only section on the flight path: the only story.
export function HomeJourney() {
  const content = useSiteContent();
  const locale = useLocale();
  const { journey } = content;

  // Beside the rail, where the reader is: the section, then each year.
  const waypoints = [
    { id: journey.id, value: formatSectionNumber(journey.id) ?? '', label: journey.title },
    ...journey.stops.map(({ id, year, label }) => ({ id, value: String(year), label })),
  ];

  return (
    <FlightPath waypoints={waypoints}>
      <PageSection id={journey.id} title={journey.title} hasListedStops onPath>
        <FlightLog
          stops={journey.stops.map(({ id, year, label, title, note }) => ({
            id,
            overline: `${String(year)} · ${label}`,
            filigree: String(year),
            title,
            content: journeyContent(year, note, content, locale),
          }))}
        />
      </PageSection>
    </FlightPath>
  );
}
