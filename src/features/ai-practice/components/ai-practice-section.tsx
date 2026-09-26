import { ChapterRows } from '@/components/layout/chapter-rows';
import { PageSection } from '@/components/layout/page-section';
import { InkText } from '@/components/ui/ink-text';
import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';

type AiPracticeSectionProps = { content: AiPracticeContent };

// The practices, one ruled chapter each: not a story, so off the flight path, but opened
// like every chapter of the page, their text inked in as it is read.
export function AiPracticeSection({ content }: AiPracticeSectionProps) {
  return (
    <PageSection id={SECTION_IDS.aiPractice} title={content.title}>
      <ChapterRows
        rows={content.items.map(({ title, text }) => ({
          id: title,
          title,
          content: <InkText text={text} size="body" />,
        }))}
      />
    </PageSection>
  );
}
