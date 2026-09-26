import { ArrowRight, Download } from 'lucide-react';
import { Fragment, type Ref } from 'react';

import { ButtonLink } from '@/components/ui/button-link';
import { KeyFigures } from '@/components/ui/key-figures';
import { PATHS, SECTION_IDS } from '@/config/paths';
import { CV_FILE, SITE_OWNER } from '@/config/site';
import { HeroPortrait } from '@/features/hero/components/hero-portrait';
import { HeroScene } from '@/features/hero/components/hero-scene';
import { TechMarquee } from '@/features/hero/components/tech-marquee';
import { type HeroContent } from '@/features/hero/types/hero-content';
import { splitIntoLetters } from '@/utils/split-text';

type HeroSectionProps = {
  content: HeroContent;
  // The page <h1> lives here; the route owns its focus management (usePageHeading).
  headingRef: Ref<HTMLHeadingElement>;
};

export function HeroSection({ content, headingRef }: HeroSectionProps) {
  return (
    // The hero fills the first screen, its technology strip resting on the bottom edge like a
    // horizon (not on short screens, where the content alone may exceed the viewport).
    <section className="relative isolate flex min-h-[calc(100svh-4.75rem)] flex-col overflow-x-clip short:min-h-0">
      <HeroScene />
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-x-12 gap-y-16 px-gutter py-section lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-6">
          <p className="enter-slide font-display text-h3 font-semibold">
            {content.greeting}
            <span className="inline-block enter-pop text-accent-fg">.</span>
          </p>
          <div className="flex flex-col gap-3">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-display font-semibold tracking-tight focus-visible:outline-hidden"
            >
              {/* Read as one name; the letters that rise one by one are for the eyes only. */}
              <span className="sr-only">{SITE_OWNER}</span>
              <span aria-hidden="true">
                {splitIntoLetters(SITE_OWNER).map(({ text, index, letters }) => (
                  <Fragment key={text}>
                    {index > 0 ? ' ' : null}
                    {/* Clips the letters while they rise; the padding keeps descenders. */}
                    <span className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]">
                      {letters.map((letter) => (
                        <span
                          key={letter.index}
                          style={{ '--i': letter.index }}
                          className="inline-block enter-letter"
                        >
                          {letter.text}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </span>
            </h1>
            <p
              lang="en"
              style={{ '--i': 4 }}
              className="enter-slide font-display text-h2 font-semibold text-accent-fg"
            >
              {/* Read once; the copy decodes itself on hover (desktop enhancements). */}
              <span className="sr-only">{content.role}</span>
              <span aria-hidden="true" data-scramble>
                {content.role}
              </span>
            </p>
          </div>
          <p style={{ '--i': 5 }} className="max-w-prose enter-slide text-lead text-fg-muted">
            {content.tagline}
          </p>
          <div style={{ '--i': 6 }} className="flex enter-rise flex-wrap gap-3">
            {/* The magnet moves the wrapper: the button keeps its own colour transition. */}
            <span data-pointer className="inline-block pointer-magnet">
              <ButtonLink
                variant="primary"
                href={`${PATHS.home}#${SECTION_IDS.contact}`}
                className="group"
              >
                Me contacter
                <ArrowRight
                  aria-hidden="true"
                  focusable="false"
                  className="size-5 transition-transform duration-250 ease-out group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </ButtonLink>
            </span>
            <span data-pointer className="inline-block pointer-magnet">
              <ButtonLink variant="secondary" href={CV_FILE.href} download className="group">
                <Download
                  aria-hidden="true"
                  focusable="false"
                  className="size-5 transition-transform duration-250 ease-out group-hover:translate-y-0.5"
                  strokeWidth={1.75}
                />
                Télécharger le CV{' '}
                <span className="font-normal text-fg-muted">({CV_FILE.formatAndWeight})</span>
              </ButtonLink>
            </span>
          </div>
          {/* The profile in three facts, set in the page rather than pinned on the photo. */}
          <KeyFigures label="En bref" figures={content.highlights} firstIndex={7} />
        </div>
        <HeroPortrait alt={content.portraitAlt} />
      </div>
      <TechMarquee technologies={content.technologies} />
    </section>
  );
}
