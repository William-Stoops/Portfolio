import { FlightLog } from '@/components/layout/flight-log';
import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { type AiPracticeContent } from '@/features/ai-practice/types/ai-practice-content';
import { formatTwoDigits } from '@/utils/format-two-digits';

type AiPracticeSectionProps = { content: AiPracticeContent };

// The practices as stops of the flight path, like the years before them: each lights up
// as the plane reaches it, its text coming in from the rail.
export function AiPracticeSection({ content }: AiPracticeSectionProps) {
  return (
    <PageSection id={SECTION_IDS.aiPractice} title={content.title}>
      <FlightLog
        size="medium"
        stops={content.items.map(({ title, text }, index) => ({
          id: `${SECTION_IDS.aiPractice}-${formatTwoDigits(index + 1)}`,
          overline: formatTwoDigits(index + 1),
          isOverlineDecoration: true,
          filigree: formatTwoDigits(index + 1),
          title,
          content: <p className="max-w-3xl text-lead text-fg-muted">{text}</p>,
        }))}
      />
    </PageSection>
  );
}
