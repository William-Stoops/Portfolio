import { Badge } from '@/components/ui/badge';
import { EmphasizedText } from '@/components/ui/emphasized-text';
import { type Experience, type ExperienceLabels } from '@/features/experience/types/experience';
import { useLocale } from '@/i18n/locale-context';
import { formatPeriod } from '@/utils/format-period';

type ExperienceCardProps = { experience: Experience; labels: ExperienceLabels };

// A role, under its year in the journey (a level-4 heading). Lays itself out from its own
// width (@container on the parent): stacked in a narrow slot, title and period side by side
// from 36rem, wherever the card is placed.
export function ExperienceCard({ experience, labels }: ExperienceCardProps) {
  const headingId = `${experience.id}-titre`;
  // The text comes from the props; only the dates are formatted in the page's language.
  const locale = useLocale();

  return (
    <article
      id={experience.id}
      aria-labelledby={headingId}
      data-pointer
      className="pointer-spotlight flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    >
      <header className="flex flex-col gap-1 @xl:flex-row @xl:items-baseline @xl:justify-between @xl:gap-6">
        <h4 id={headingId} className="text-h3 font-semibold">
          <span lang="en">{experience.role}</span>
          <span className="sr-only">, </span>
          <span className="block font-sans text-body font-normal text-fg-muted">
            {experience.company}
          </span>
        </h4>
        <p className="text-small whitespace-nowrap text-fg-muted">
          {formatPeriod(experience.period, locale)}
        </p>
      </header>

      {experience.companyDescription === undefined ? null : (
        <p className="text-small text-fg-muted">{experience.companyDescription}</p>
      )}

      <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-accent-fg">
        {experience.highlights.map((highlight) => (
          <li key={highlight} className="max-w-prose text-fg-muted">
            <EmphasizedText text={highlight} />
          </li>
        ))}
      </ul>

      {experience.stack === undefined ? null : (
        <ul aria-label={labels.technologies} className="flex flex-wrap gap-2">
          {experience.stack.map((technology) => (
            <li key={technology}>
              <Badge>{technology}</Badge>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
