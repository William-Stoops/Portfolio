import { lazy, Suspense } from 'react';

import { useSiteContent } from '@/app/content/site-content-context';
import { ChapterRows } from '@/components/layout/chapter-rows';
import { PageMetadata } from '@/components/layout/page-metadata';
import { PageSection } from '@/components/layout/page-section';
import { SITE_TITLE } from '@/config/site';
import { AiPracticeSection } from '@/features/ai-practice/components/ai-practice-section';
import { ContactSection } from '@/features/contact/components/contact-section';
import { EducationList } from '@/features/education/components/education-list';
import { HeroSection } from '@/features/hero/components/hero-section';
import { SkillList } from '@/features/skills/components/skill-list';
import { usePageHeading } from '@/hooks/use-page-heading';
import { chapterHeadingId } from '@/utils/chapter-heading-id';

// The journey is most of the page's code to hydrate, and it starts below the fold: its
// code is its own chunk, loaded as hydration reaches it. The prerender waits for it, so
// its HTML is there from the start (ADR 0020).
const HomeJourney = lazy(() =>
  import('@/app/routes/home-journey').then(({ HomeJourney: journey }) => ({ default: journey })),
);

// Who William is, his story (the only section on the flight path), what he masters, how to
// reach him: five chapters, each opened the same way (PageSection).
export function HomeRoute() {
  const headingRef = usePageHeading();
  const content = useSiteContent();
  const { skills } = content;
  // The hero's proof leads to the IT-Finance role, the first of the journey.
  const [itFinance] = content.experiences.entries;

  // The skills, one group a chapter, then the education.
  const skillChapters = [
    ...skills.groups.map(({ id, name, skills: groupSkills }) => ({
      id,
      title: name,
      headingId: chapterHeadingId(id),
      content: <SkillList skills={groupSkills} labelledBy={chapterHeadingId(id)} />,
    })),
    {
      id: 'formation',
      title: skills.education.title,
      headingId: chapterHeadingId('formation'),
      content: (
        <EducationList
          entries={skills.education.entries}
          labelledBy={chapterHeadingId('formation')}
        />
      ),
    },
  ];

  return (
    <>
      <PageMetadata title={SITE_TITLE} description={content.home.description} />
      <HeroSection
        content={content.hero}
        headingRef={headingRef}
        contactHref={`#${content.contact.id}`}
        proofHref={`#${itFinance.id}`}
      />
      {/*
        Each section below the hero is its own Suspense boundary, hydrated as a separate
        unit of work after the hero: React yields to the browser between them instead of
        hydrating the whole page in one long task. Only the journey suspends, for its code;
        the other boundaries only split the hydration (ADR 0018).
      */}
      <Suspense>
        <HomeJourney />
      </Suspense>
      <Suspense>
        <AiPracticeSection content={content.aiPractice} />
      </Suspense>
      <Suspense>
        {/* Two features in one section: composition belongs to the route, not to a feature. */}
        <PageSection id={skills.id} title={skills.title}>
          <ChapterRows rows={skillChapters} />
        </PageSection>
      </Suspense>
      <Suspense>
        <ContactSection content={content.contact} />
      </Suspense>
    </>
  );
}
