import { Suspense } from 'react';

import { PageSection } from '@/components/layout/page-section';
import { StickyChapters } from '@/components/layout/sticky-chapters';
import { chapterHeadingId } from '@/utils/chapter-heading-id';
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
import { KoreaBand } from '@/features/korea/components/korea-band';
import { KoreaSection } from '@/features/korea/components/korea-section';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content';
import { AboutSection } from '@/features/about/components/about-section';
import { AxisBand } from '@/features/about/components/axis-band';
import { ABOUT_CONTENT } from '@/features/about/data/about-content';
import { ExperienceSection } from '@/features/experience/components/experience-section';
import { EXPERIENCES } from '@/features/experience/data/experiences';
import { ProjectsSection } from '@/features/projects/components/projects-section';
import { PROJECTS } from '@/features/projects/data/projects';
import { HeroScene } from '@/features/hero/components/hero-scene';
import { HeroSection } from '@/features/hero/components/hero-section';
import { HERO_CONTENT } from '@/features/hero/data/hero-content';
import { usePageHeading } from '@/hooks/use-page-heading';

export function HomeRoute() {
  const headingRef = usePageHeading();

  return (
    <>
      <title>{SITE_TITLE}</title>
      <HeroSection content={HERO_CONTENT} headingRef={headingRef} />
      {/*
        Each section below the hero is its own Suspense boundary, hydrated as a separate
        unit of work after the hero: React yields to the browser between them instead of
        hydrating the whole page in one long task. Nothing here suspends; the boundaries
        only split the hydration (ADR 0018).
      */}
      <Suspense>
        <AboutSection content={ABOUT_CONTENT} />
      </Suspense>
      <Suspense>
        <AxisBand axes={ABOUT_CONTENT.axes} />
      </Suspense>
      <Suspense>
        <ExperienceSection experiences={EXPERIENCES} />
      </Suspense>
      <Suspense>
        <ProjectsSection projects={PROJECTS} />
      </Suspense>
      <Suspense>
        <AiPracticeSection content={AI_PRACTICE_CONTENT} />
      </Suspense>
      <Suspense>
        <KoreaBand band={KOREA_CONTENT.band} />
      </Suspense>
      <Suspense>
        <KoreaSection content={KOREA_CONTENT} />
      </Suspense>
      <Suspense>
        {/* Two features in one section: composition belongs to the route, not to a feature. */}
        <PageSection id={SECTION_IDS.skills} title="Compétences et formation">
          <StickyChapters
            chapters={[
              ...SKILL_GROUPS.map(({ id, name, skills }) => ({
                id,
                title: name,
                content: <SkillList skills={skills} labelledBy={chapterHeadingId(id)} />,
              })),
              {
                id: 'formation',
                title: 'Formation',
                content: (
                  <EducationList
                    entries={EDUCATION_ENTRIES}
                    labelledBy={chapterHeadingId('formation')}
                  />
                ),
              },
            ]}
          />
        </PageSection>
      </Suspense>
      <Suspense>
        <ContactSection content={CONTACT_CONTENT} backdrop={<HeroScene variant="finale" />} />
      </Suspense>
    </>
  );
}
