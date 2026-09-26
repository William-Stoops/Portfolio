import { Fragment } from 'react';

import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { MetricVisual } from '@/features/about/components/metric-visual';
import { type AboutContent } from '@/features/about/types/about-content';
import { splitIntoWords } from '@/utils/split-text';

type AboutSectionProps = { content: AboutContent };

const FIGURES_CAPTION_ID = 'a-propos-chiffres';

export function AboutSection({ content }: AboutSectionProps) {
  const profileWords = splitIntoWords(content.profile);

  return (
    <PageSection
      id={SECTION_IDS.about}
      title="À propos"
      lead={
        // Inked in word by word as it is read (motion.css); the text itself stays whole
        // and at full contrast underneath.
        <p
          style={{ '--n': profileWords.length }}
          className="max-w-5xl font-display text-h3 font-medium text-fg ink-timeline"
        >
          {profileWords.map(({ text, index }) => (
            <Fragment key={index}>
              {index > 0 ? ' ' : null}
              <span data-word style={{ '--i': index }} className="reveal-ink">
                {text}
              </span>
            </Fragment>
          ))}
        </p>
      }
    >
      <ul aria-label="Axes" className="grid gap-10 md:grid-cols-3 md:gap-8">
        {content.axes.map(({ title, description }, index) => (
          <li key={title} style={{ '--i': index }} className="flex reveal-slide flex-col gap-4">
            {/* A hairline with the accent drawn on it, like each section's number. */}
            <span aria-hidden="true" className="block border-t border-border">
              <span className="-mt-px block h-0.5 w-12 reveal-grow-x bg-accent" />
            </span>
            <h3 className="text-h3 font-semibold">{title}</h3>
            <p className="text-fg-muted">{description}</p>
          </li>
        ))}
      </ul>

      {/* A ledger of measurements rather than cards: the figure, what it measures, its drawing. */}
      <div className="flex flex-col gap-4">
        <p
          id={FIGURES_CAPTION_ID}
          className="text-small font-semibold tracking-[0.2em] text-fg-subtle uppercase"
        >
          Chiffres clés
        </p>
        <ul aria-labelledby={FIGURES_CAPTION_ID} className="border-b border-border">
          {content.metrics.map(({ value, spokenValue, label, visual }) => (
            <li
              key={value}
              className="grid reveal-slide gap-x-10 gap-y-3 border-t border-border py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_minmax(0,3fr)] md:items-center"
            >
              <p className="font-display text-metric font-semibold whitespace-nowrap text-accent-fg tabular-nums">
                {spokenValue === undefined ? (
                  value
                ) : (
                  <>
                    <span aria-hidden="true">{value}</span>
                    <span className="sr-only">{spokenValue}</span>
                  </>
                )}
              </p>
              <p className="text-fg-muted">{label}</p>
              <MetricVisual visual={visual} />
            </li>
          ))}
        </ul>
      </div>
    </PageSection>
  );
}
