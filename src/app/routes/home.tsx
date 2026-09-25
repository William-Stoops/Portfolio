import { SITE_TITLE } from '@/config/site';
import { AiPracticeSection } from '@/features/ai-practice/components/ai-practice-section';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content';
import { AboutSection } from '@/features/about/components/about-section';
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
      <ExperienceSection experiences={EXPERIENCES} />
      <ProjectsSection projects={PROJECTS} />
      <AiPracticeSection content={AI_PRACTICE_CONTENT} />
    </>
  );
}
