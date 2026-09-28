import { lazy, Suspense } from 'react';

import { FlightLog } from '@/components/layout/flight-log';
import { FlightPath } from '@/components/layout/flight-path';
import { PageSection } from '@/components/layout/page-section';
import { chapterHeadingId } from '@/utils/chapter-heading-id';
import { formatTwoDigits } from '@/utils/format-two-digits';
import { formatSectionNumber } from '@/utils/section-number';
import { SECTION_IDS } from '@/config/paths';
import { SITE_TITLE } from '@/config/site';
import { ContactSection } from '@/features/contact/components/contact-section';
import { CONTACT_CONTENT } from '@/features/contact/data/contact-content';
import { EducationList } from '@/features/education/components/education-list';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries';
import { SkillList } from '@/features/skills/components/skill-list';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups';
import { AiPracticeSection } from '@/features/ai-practice/components/ai-practice-section';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content';
import { AboutSection } from '@/features/about/components/about-section';
import { AxisBand } from '@/features/about/components/axis-band';
import { ABOUT_CONTENT } from '@/features/about/data/about-content';
import { JOURNEY_STOPS } from '@/features/journey/data/journey-stops';
import { HeroScene } from '@/features/hero/components/hero-scene';
import { HeroSection } from '@/features/hero/components/hero-section';
import { HERO_CONTENT } from '@/features/hero/data/hero-content';
import { usePageHeading } from '@/hooks/use-page-heading';

// The journey is most of the page's code to hydrate, and it starts below the fold: its
// code is its own chunk, loaded as hydration reaches it. The prerender waits for it, so
// its HTML is there from the start (ADR 0020).
const HomeJourney = lazy(() =>
  import('@/app/routes/home-journey').then(({ HomeJourney: journey }) => ({ default: journey })),
);

function sectionWaypoint(id: string, label: string) {
  return { id, value: formatSectionNumber(id) ?? '', label };
}

// Where the reader is, beside the rail: each section, and each year of the journey.
const WAYPOINTS = [
  sectionWaypoint(SECTION_IDS.about, 'À propos'),
  sectionWaypoint(SECTION_IDS.experience, 'Parcours'),
  ...JOURNEY_STOPS.map(({ id, year, label }) => ({ id, value: String(year), label })),
  sectionWaypoint(SECTION_IDS.aiPractice, 'IA'),
  sectionWaypoint(SECTION_IDS.skills, 'Compétences'),
  sectionWaypoint(SECTION_IDS.contact, 'Contact'),
];

// The skills, then the education, as the chapters of one section.
const SKILL_CHAPTERS = [
  ...SKILL_GROUPS.map(({ id, name, skills }) => ({
    id,
    title: name,
    content: <SkillList skills={skills} labelledBy={chapterHeadingId(id)} />,
  })),
  {
    id: 'formation',
    title: 'Formation',
    content: (
      <EducationList entries={EDUCATION_ENTRIES} labelledBy={chapterHeadingId('formation')} />
    ),
  },
];

export function HomeRoute() {
  const headingRef = usePageHeading();

  return (
    <>
      <title>{SITE_TITLE}</title>
      <HeroSection content={HERO_CONTENT} headingRef={headingRef} />
      {/* From the first section to the contact, the page is one flight (FlightPath). */}
      <FlightPath waypoints={WAYPOINTS}>
        {/*
          Each section below the hero is its own Suspense boundary, hydrated as a separate
          unit of work after the hero: React yields to the browser between them instead of
          hydrating the whole page in one long task. Only the journey suspends, for its code;
          the other boundaries only split the hydration (ADR 0018).
        */}
        <Suspense>
          <AboutSection content={ABOUT_CONTENT} />
        </Suspense>
        <Suspense>
          <AxisBand axes={ABOUT_CONTENT.axes} />
        </Suspense>
        <Suspense>
          <HomeJourney />
        </Suspense>
        <Suspense>
          <AiPracticeSection content={AI_PRACTICE_CONTENT} />
        </Suspense>
        <Suspense>
          {/* Two features in one section: composition belongs to the route, not to a feature. */}
          <PageSection id={SECTION_IDS.skills} title="Compétences et formation">
            <FlightLog
              size="medium"
              stops={SKILL_CHAPTERS.map(({ id, title, content }, index) => ({
                // Prefixed: a chapter's anchor must not take a section's (the IA chapter).
                id: `${SECTION_IDS.skills}-${id}`,
                overline: `${formatTwoDigits(index + 1)} / ${formatTwoDigits(SKILL_CHAPTERS.length)}`,
                isOverlineDecoration: true,
                filigree: formatTwoDigits(index + 1),
                title,
                headingId: chapterHeadingId(id),
                content,
              }))}
            />
          </PageSection>
        </Suspense>
        <Suspense>
          <ContactSection content={CONTACT_CONTENT} backdrop={<HeroScene variant="finale" />} />
        </Suspense>
      </FlightPath>
    </>
  );
}
