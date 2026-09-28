import { ChevronRight } from 'lucide-react';
import { type Ref } from 'react';

import { ResponsiveImage } from '@/components/ui/responsive-image';
import { CV_FILE } from '@/config/site';
import { FlowField } from '@/features/hero/components/flow-field';
import { PORTRAIT_PICTURE } from '@/features/hero/data/portrait-picture';
import { type HeroContent } from '@/features/hero/types/hero-content';

type HeroSectionProps = {
  content: HeroContent;
  // The page <h1> lives here; the route owns its focus management (usePageHeading).
  headingRef: Ref<HTMLHeadingElement>;
  // Where the two ways in lead: the contact section and the IT-Finance story, on the page.
  contactHref: string;
  proofHref: string;
};

const CHEVRON = (
  <ChevronRight
    aria-hidden="true"
    focusable="false"
    className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5"
    strokeWidth={2}
  />
);

// A card floating on the edge of the photo: the site's white, a wide soft shadow. The hero
// slides in without fading: a picture or a large text at opacity 0 is not counted as
// painted, and would delay the Largest Contentful Paint.
const CHIP_CLASS_NAME = 'absolute rounded-md bg-canvas text-fg shadow-card enter-slide';

// The opening of the home page (ADR 0037): a living field of colour behind the sentence of
// the CV, the ways to act on it, and William's photo, large, framed in a card, with one
// proof floating on its edge. The field is decoration; everything else is read in order.
export function HeroSection({ content, headingRef, contactHref, proofHref }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden pt-(--header-height)">
      {/* The field's frame: the content above the keywords, whose foot the field reaches. */}
      <div className="relative">
        <FlowField />
        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-14 px-gutter pt-8 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:pt-12 lg:pb-24">
          <div>
            <p className="flex items-center gap-2.5 text-small font-medium">
              <span aria-hidden="true" className="size-2 rounded-full bg-fg" />
              {content.eyebrow}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-6 enter-slide text-display font-semibold tracking-tighter focus-visible:outline-hidden"
            >
              <span className="sr-only">{content.ownerPrefix}</span>
              {content.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lead">{content.lead}</p>
            <p className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 font-medium">
              <a
                href={contactHref}
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-fg px-5 text-canvas no-underline transition-colors duration-250 hover:bg-accent hover:text-on-accent"
              >
                {content.actions.contact}
                {CHEVRON}
              </a>
              <a
                href={CV_FILE.href}
                download
                className="group inline-flex min-h-11 items-center gap-1.5 text-fg no-underline"
              >
                {content.actions.downloadCv}
                <span className="sr-only"> ({content.actions.cvDetails})</span>
                {CHEVRON}
              </a>
            </p>
          </div>

          <div className="relative mx-3 lg:mx-0 lg:w-[min(100%,31rem)] lg:justify-self-end">
            <div className="aspect-4/5 max-h-[76svh] enter-slide overflow-hidden rounded-lg shadow-card">
              <ResponsiveImage
                picture={PORTRAIT_PICTURE}
                alt={content.portraitAlt}
                sizes="(min-width: 64rem) 31rem, 100vw"
                loading="critical"
                className="size-full object-cover object-[50%_30%]"
              />
            </div>
            <a
              href={proofHref}
              style={{ '--i': 6 }}
              className={`${CHIP_CLASS_NAME} group -start-3 bottom-[8%] block w-72 px-5 py-4 no-underline lg:-start-12`}
            >
              <span className="block text-small text-fg-muted">{content.proof.context}</span>
              <span className="mt-1.5 block text-metric font-semibold tracking-tight">
                {content.proof.before}{' '}
                <span className="text-accent-fg">→ {content.proof.after}</span>
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-small font-medium text-accent-fg">
                {content.proof.link}
                {CHEVRON}
              </span>
            </a>
          </div>
        </div>
      </div>

      <ul
        aria-label={content.keywordsLabel}
        className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-8 gap-y-3 border-t border-border px-gutter py-6 font-medium text-fg-subtle"
      >
        {content.keywords.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
    </section>
  );
}
