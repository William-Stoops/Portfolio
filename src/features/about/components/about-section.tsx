import { Bot, Gauge, Layers } from 'lucide-react';
import { type ReactNode } from 'react';

import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { MetricVisual } from '@/features/about/components/metric-visual';
import { type AboutContent } from '@/features/about/types/about-content';

type AboutSectionProps = { content: AboutContent };

const ICON_PROPS = { focusable: 'false', className: 'size-7', strokeWidth: 1.75 } as const;

const AXIS_ICONS: Readonly<Record<AboutContent['axes'][number]['icon'], ReactNode>> = {
  performance: <Gauge {...ICON_PROPS} />,
  'full-stack': <Layers {...ICON_PROPS} />,
  ai: <Bot {...ICON_PROPS} />,
};

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <PageSection
      id={SECTION_IDS.about}
      title="À propos"
      lead={
        <p className="max-w-4xl reveal font-display text-h3 font-medium text-fg">
          {content.profile}
        </p>
      }
    >
      <ul aria-label="Axes" className="border-t border-border">
        {content.axes.map(({ title, description, icon }, index) => (
          <li
            key={title}
            style={{ '--i': index }}
            className="group grid reveal gap-x-8 gap-y-3 border-b border-border py-8 md:grid-cols-[auto_minmax(0,2fr)_minmax(0,3fr)] md:items-center"
          >
            <span
              aria-hidden="true"
              className="inline-grid size-14 place-items-center rounded-full bg-accent-tint text-accent-fg transition-[rotate,scale] duration-250 ease-out group-hover:scale-110 group-hover:-rotate-12"
            >
              {AXIS_ICONS[icon]}
            </span>
            <h3 className="text-h2 font-semibold transition-[translate] duration-250 ease-out group-hover:translate-x-2">
              {title}
            </h3>
            <p className="text-fg-muted">{description}</p>
          </li>
        ))}
      </ul>

      <ul aria-label="Chiffres clés" className="grid gap-4 sm:grid-cols-2">
        {content.metrics.map(({ value, spokenValue, label, visual }, index) => (
          <li
            key={value}
            data-pointer
            style={{ '--i': index }}
            className="pointer-spotlight flex reveal flex-col gap-3 rounded-lg border border-border bg-surface p-6"
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
            <p className="flex-1 text-small text-fg-muted">{label}</p>
            <MetricVisual visual={visual} />
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
