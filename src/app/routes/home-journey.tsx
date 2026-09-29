import { type ReactNode } from 'react';

import { type SiteContent } from '@/app/content/site-content';
import { useSiteContent } from '@/app/content/site-content-context';
import { FlightLog } from '@/components/layout/flight-log';
import { FlightPath } from '@/components/layout/flight-path';
import { PageSection } from '@/components/layout/page-section';
import { Statement } from '@/components/ui/statement';
import { JOURNEY_ANCHORS } from '@/config/paths';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { RecommendationQuote } from '@/features/experience/components/recommendation-quote';
import { VolatilityLab } from '@/features/experience/components/volatility-lab';
import { KoreaChapter } from '@/features/korea/components/korea-chapter';
import { ReturnStage } from '@/features/korea/components/return-stage';
import { ProjectCard } from '@/features/projects/components/project-card';
import { useScrollHeading } from '@/hooks/use-scroll-heading';
import { useLocale } from '@/i18n/locale-context';
import { type Locale } from '@/i18n/locales';

// What each year of the journey holds: its note, then the cards that tell the year (the
// roles and what was said of them, the year in South Korea, STAXX). Chosen by the year,
// which no language changes; composing features belongs to the route.
function journeyContent(
  year: number,
  note: string | undefined,
  content: SiteContent,
  locale: Locale,
): ReactNode {
  const noteParagraph = note === undefined ? null : <Statement text={note} />;
  const [itFinance, intm, strattt, gdsElec] = content.experiences.entries;
  const { labels } = content.experiences;
  switch (year) {
    case 2022: {
      return <ExperienceCard experience={gdsElec} labels={labels} />;
    }
    case 2023: {
      return (
        <>
          {noteParagraph}
          <ExperienceCard experience={strattt} labels={labels} />
          <ExperienceCard experience={intm} labels={labels} />
          <div className="@container">
            <RecommendationQuote recommendation={content.experiences.recommendation} />
          </div>
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
// holding the cards that tell it. The only section on the flight path: the only story. It
// opens straight on its first year, the rail naming each year beside it.
export function HomeJourney() {
  // Its planes face the way the reader goes (plane-heading).
  useScrollHeading();
  const content = useSiteContent();
  const locale = useLocale();
  const { journey } = content;

  // Beside the rail, where the reader is: each year.
  const waypoints = journey.stops.map(({ id, year, label }) => ({
    id,
    value: String(year),
    label,
  }));

  return (
    <FlightPath waypoints={waypoints}>
      <PageSection id={journey.id} title={journey.title} isTitleHidden>
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
