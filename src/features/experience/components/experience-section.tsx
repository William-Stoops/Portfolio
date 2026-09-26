import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { type Experience } from '@/features/experience/types/experience';
import { formatPeriod } from '@/utils/format-period';

type ExperienceSectionProps = { experiences: readonly Experience[] };

// A timeline: the rail fills as the list scrolls through the viewport, and each step
// lights up when its role reaches the middle of the screen (scroll-driven CSS). On large
// screens each period is also set large in a column left of the rail, and stays in view
// while its role is read, like the dates of a magazine timeline. Rail, steps and large
// periods are drawings; the ordered list and each card already tell the sequence.
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <PageSection id={SECTION_IDS.experience} title="Parcours">
      <div className="relative rail-timeline lg:ps-52">
        <div
          data-rail
          aria-hidden="true"
          className="absolute inset-y-4 start-[0.4375rem] w-0.5 rounded-full bg-border lg:start-[13.4375rem]"
        >
          <div className="size-full rail-fill rounded-full bg-accent" />
        </div>
        <ol className="flex flex-col gap-10">
          {experiences.map((experience, index) => (
            <li key={experience.id} className="@container relative ps-10 md:ps-14">
              {/* The column spans the role's height, so the period sticks while it is read. */}
              <div aria-hidden="true" className="absolute inset-y-0 -start-52 hidden w-44 lg:block">
                <p
                  data-period-marker
                  className="sticky top-32 reveal pt-5 font-display text-h3 font-semibold text-balance text-fg-muted"
                >
                  {formatPeriod(experience.period)}
                </p>
              </div>
              <span
                data-rail-step
                aria-hidden="true"
                className="absolute start-0 top-8 size-4 rounded-full border-2 border-accent bg-canvas"
              >
                <span className="absolute inset-0.5 reveal-fill rounded-full bg-accent" />
              </span>
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
