import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';
import { formatTwoDigits } from '@/utils/format-two-digits';

type AiPracticeSectionProps = { content: AiPracticeContent };

// On large screens the cards stick one below the other while the page scrolls, each one
// sliding over the previous and leaving its number and title in view, like tabs. Not on
// short screens, where a sticky card would hide the rest; on small ones they simply follow
// each other.
export function AiPracticeSection({ content }: AiPracticeSectionProps) {
  return (
    <PageSection id={SECTION_IDS.aiPractice} title={content.title}>
      <ul className="flex flex-col gap-6 lg:gap-24">
        {content.items.map(({ title, text }, index) => (
          <li
            key={title}
            style={{ '--i': index }}
            className="lg:sticky lg:top-[calc(8rem+var(--i)*6rem)] short:static"
          >
            <div
              data-pointer
              className="pointer-spotlight grid reveal gap-6 rounded-lg border border-border bg-surface p-8 shadow-overlay md:grid-cols-[auto_minmax(0,1fr)] md:gap-10"
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
