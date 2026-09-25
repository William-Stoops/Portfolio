import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { type Experience } from '@/features/experience/types/experience';

type ExperienceSectionProps = { experiences: readonly Experience[] };

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <PageSection id={SECTION_IDS.experience} title="Parcours">
      <ol className="flex flex-col gap-6">
        {experiences.map((experience) => (
          <li key={experience.id} className="@container">
            <ExperienceCard experience={experience} />
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
