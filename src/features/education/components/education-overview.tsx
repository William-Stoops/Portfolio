import { type EducationEntry } from '@/features/education/types/education-entry';
import { formatPeriod } from '@/utils/format-period';

type EducationOverviewProps = { entries: readonly EducationEntry[] };

export function EducationOverview({ entries }: EducationOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-h3 font-semibold">Formation</h3>
      <ul className="flex flex-col gap-4">
        {entries.map(({ id, title, degree, description, period }) => (
          <li key={id} className="flex flex-col gap-1 border-s-2 border-accent ps-4">
            <h4 className="font-display font-semibold">{title}</h4>
            {degree === undefined ? null : (
              <p lang="en" className="font-semibold text-fg">
                {degree}
              </p>
            )}
            <p className="text-fg-muted">{description}</p>
            {period === undefined ? null : (
              <p className="text-small text-fg-muted">{formatPeriod(period)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
