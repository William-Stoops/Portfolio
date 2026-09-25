import { type Ref } from 'react';

import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button-link';
import { CONTACT_EMAIL, CV_FILE, SITE_OWNER } from '@/config/site';
import { HeroPortrait } from '@/features/hero/components/hero-portrait';
import { type HeroContent } from '@/features/hero/types/hero-content';

type HeroSectionProps = {
  content: HeroContent;
  // The page <h1> lives here; the route owns its focus management (usePageHeading).
  headingRef: Ref<HTMLHeadingElement>;
};

export function HeroSection({ content, headingRef }: HeroSectionProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-x-12 gap-y-10 px-gutter py-section lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="flex flex-col gap-6">
        <p className="font-display text-h3 font-semibold">
          {content.greeting}
          <span className="text-accent-fg">.</span>
        </p>
        <div className="flex flex-col gap-3">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-display font-semibold tracking-tight focus-visible:outline-hidden"
          >
            {SITE_OWNER}
          </h1>
          <p lang="en" className="font-display text-h2 font-semibold text-accent-fg">
            {content.role}
          </p>
        </div>
        <p className="max-w-prose text-lead text-fg-muted">{content.tagline}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink variant="primary" href={`mailto:${CONTACT_EMAIL}`}>
            Me contacter
          </ButtonLink>
          <ButtonLink variant="secondary" href={CV_FILE.href} download>
            Télécharger le CV{' '}
            <span className="font-normal text-fg-muted">({CV_FILE.formatAndWeight})</span>
          </ButtonLink>
        </div>
      </div>
      <HeroPortrait alt={content.portraitAlt} />
      <ul aria-label="Technologies" className="flex flex-wrap gap-2 lg:col-span-2">
        {content.technologies.map((technology) => (
          <li key={technology}>
            <Badge>{technology}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
