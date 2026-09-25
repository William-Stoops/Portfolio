import { SECTION_IDS } from '@/config/paths';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { type Experience } from '@/features/experience/types/experience';

type ExperienceSectionProps = { experiences: readonly Experience[] };

const HEADING_ID = `${SECTION_IDS.experience}-titre`;

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section
      id={SECTION_IDS.experience}
      aria-labelledby={HEADING_ID}
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-gutter py-section"
    >
      <h2 id={HEADING_ID} className="text-h2 font-semibold">
        Parcours
      </h2>
      <ol className="flex flex-col gap-6">
        {experiences.map((experience) => (
          <li key={experience.id} className="@container">
            <ExperienceCard experience={experience} />
          </li>
        ))}
      </ol>
    </section>
  );
}
