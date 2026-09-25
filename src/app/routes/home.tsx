import { SITE_TITLE } from '@/config/site';
import { AboutSection } from '@/features/about/components/about-section';
import { ABOUT_CONTENT } from '@/features/about/data/about-content';
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
    </>
  );
}
