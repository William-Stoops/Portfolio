import { Badge } from '@/components/ui/badge';
import { type Experience } from '@/features/experience/types/experience';
import { formatPeriod } from '@/utils/format-period';
import { parseEmphasis } from '@/utils/parse-emphasis';

type ExperienceCardProps = { experience: Experience };

// Lays itself out from its own width (@container on the parent): stacked in a narrow slot,
// title and period side by side from 36rem, wherever the card is placed.
export function ExperienceCard({ experience }: ExperienceCardProps) {
  const headingId = `${experience.id}-titre`;

  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    >
      <header className="flex flex-col gap-1 @xl:flex-row @xl:items-baseline @xl:justify-between @xl:gap-6">
        <h3 id={headingId} className="text-h3 font-semibold">
          <span lang="en">{experience.role}</span>
          <span className="sr-only">, </span>
          <span className="block font-sans text-body font-normal text-fg-muted">
            {experience.company}
          </span>
        </h3>
        <p className="text-small whitespace-nowrap text-fg-muted">
          {formatPeriod(experience.period)}
        </p>
      </header>

      {experience.companyDescription === undefined ? null : (
        <p className="text-small text-fg-muted">{experience.companyDescription}</p>
      )}

      <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-accent-fg">
        {experience.highlights.map((highlight) => (
          <li key={highlight} className="max-w-prose text-fg-muted">
            {parseEmphasis(highlight).map(({ text, isEmphasized }) =>
              isEmphasized ? (
                <strong key={text} className="font-semibold text-fg">
                  {text}
                </strong>
              ) : (
                text
              ),
            )}
          </li>
        ))}
      </ul>

      {experience.stack === undefined ? null : (
        <ul aria-label="Technologies utilisées" className="flex flex-wrap gap-2">
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
