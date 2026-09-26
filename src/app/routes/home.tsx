import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { SITE_TITLE } from '@/config/site';
import { ContactSection } from '@/features/contact/components/contact-section';
import { CONTACT_CONTENT } from '@/features/contact/data/contact-content';
import { EducationOverview } from '@/features/education/components/education-overview';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries';
import { SkillsOverview } from '@/features/skills/components/skills-overview';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups';
import { AiPracticeSection } from '@/features/ai-practice/components/ai-practice-section';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content';
import { AboutSection } from '@/features/about/components/about-section';
import { AxisBand } from '@/features/about/components/axis-band';
import { ABOUT_CONTENT } from '@/features/about/data/about-content';
import { ExperienceSection } from '@/features/experience/components/experience-section';
import { EXPERIENCES } from '@/features/experience/data/experiences';
import { ProjectsSection } from '@/features/projects/components/projects-section';
import { PROJECTS } from '@/features/projects/data/projects';
import { HeroSection } from '@/features/hero/components/hero-section';
import { HERO_CONTENT } from '@/features/hero/data/hero-content';
import { usePageHeading } from '@/hooks/use-page-heading';

export function HomeRoute() {
  const headingRef = usePageHeading();

  return (
    <>
      <title>{SITE_TITLE}</title>
      <HeroSection content={HERO_CONTENT} headingRef={headingRef} />
      <AboutSection content={ABOUT_CONTENT} />
      <AxisBand axes={ABOUT_CONTENT.axes} />
      <ExperienceSection experiences={EXPERIENCES} />
      <ProjectsSection projects={PROJECTS} />
      <AiPracticeSection content={AI_PRACTICE_CONTENT} />
      {/* Two features in one section: composition belongs to the route, not to a feature. */}
      <PageSection id={SECTION_IDS.skills} title="Compétences et formation">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] gap-x-12 gap-y-10">
          <SkillsOverview groups={SKILL_GROUPS} />
          <EducationOverview entries={EDUCATION_ENTRIES} />
        </div>
      </PageSection>
      <ContactSection content={CONTACT_CONTENT} />
    </>
  );
}
