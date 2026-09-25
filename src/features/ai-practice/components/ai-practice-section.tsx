import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';

type AiPracticeSectionProps = { content: AiPracticeContent };

export function AiPracticeSection({ content }: AiPracticeSectionProps) {
  return (
    <PageSection id={SECTION_IDS.aiPractice} title={content.title}>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6">
        {content.items.map(({ title, text }) => (
          <li
            key={title}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-6"
          >
            <h3 className="text-h3 font-semibold">{title}</h3>
            <p className="text-fg-muted">{text}</p>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
