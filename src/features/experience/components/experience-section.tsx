import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { type Experience } from '@/features/experience/types/experience';

type ExperienceSectionProps = { experiences: readonly Experience[] };

// A timeline: the rail fills as the list scrolls through the viewport, and each step
// lights up when its role reaches the middle of the screen (scroll-driven CSS). Rail and
// steps are drawings; the ordered list already tells the sequence.
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <PageSection id={SECTION_IDS.experience} title="Parcours">
      <div className="relative rail-timeline">
        <div
          data-rail
          aria-hidden="true"
          className="absolute inset-y-4 start-[0.4375rem] w-0.5 rounded-full bg-border"
        >
          <div className="size-full rail-fill rounded-full bg-accent" />
        </div>
        <ol className="flex flex-col gap-10">
          {experiences.map((experience, index) => (
            <li key={experience.id} className="@container relative ps-10 md:ps-14">
              <span
                data-rail-step
                aria-hidden="true"
                className="absolute start-0 top-8 size-4 reveal-light-up rounded-full border-2 border-accent bg-canvas"
              />
              <div style={{ '--i': index }} className="reveal">
                <ExperienceCard experience={experience} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PageSection>
  );
}
