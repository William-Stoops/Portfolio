import { SECTION_IDS } from '@/config/paths';
import { type AboutContent } from '@/features/about/types/about-content';

type AboutSectionProps = { content: AboutContent };

const HEADING_ID = `${SECTION_IDS.about}-titre`;

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby={HEADING_ID}
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-gutter py-section"
    >
      <div className="flex flex-col gap-4">
        <h2 id={HEADING_ID} className="text-h2 font-semibold">
          À propos
        </h2>
        <p className="max-w-prose text-lead text-fg-muted">{content.profile}</p>
      </div>

      <ul
        aria-label="Axes"
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6"
      >
        {content.axes.map(({ title, description }) => (
          <li
            key={title}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-6"
          >
            <h3 className="text-h3 font-semibold">{title}</h3>
            <p className="text-fg-muted">{description}</p>
          </li>
        ))}
      </ul>

      <ul
        aria-label="Chiffres clés"
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-x-6 gap-y-8"
      >
        {content.metrics.map(({ value, spokenValue, label }) => (
          <li key={value} className="flex flex-col gap-2 border-t-2 border-accent pt-4">
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
            <p className="text-small text-fg-muted">{label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
