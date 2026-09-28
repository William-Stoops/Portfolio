import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';
import { formatTwoDigits } from '@/utils/format-two-digits';

type AiPracticeSectionProps = { content: AiPracticeContent };

// The practices follow each other, each card sliding in as it arrives: never stuck over
// one another. (Cards stacked like tabs cut the previous card's text mid-sentence.)
export function AiPracticeSection({ content }: AiPracticeSectionProps) {
  return (
    <PageSection id={SECTION_IDS.aiPractice} title={content.title}>
      <ul className="flex flex-col gap-6">
        {content.items.map(({ title, text }, index) => (
          <li key={title} style={{ '--i': index }}>
            <div
              data-pointer
              className="pointer-spotlight grid reveal-slide gap-6 rounded-lg border border-border bg-surface p-8 shadow-overlay md:grid-cols-[auto_minmax(0,1fr)] md:gap-10"
            >
              <span
                data-item-number
                aria-hidden="true"
                className="font-display text-display leading-none font-bold text-accent-fg tabular-nums"
              >
                {formatTwoDigits(index + 1)}
              </span>
              <div className="flex max-w-prose flex-col gap-3">
                <h3 className="text-h2 font-semibold tracking-tight">{title}</h3>
                <p className="text-lead text-fg-muted">{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
