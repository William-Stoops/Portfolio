import { type EducationEntry } from '@/features/education/types/education-entry';
import { useLocale } from '@/i18n/locale-context';
import { formatPeriod } from '@/utils/format-period';

type EducationListProps = {
  entries: readonly EducationEntry[];
  // The heading that names the list (the chapter's title).
  labelledBy: string;
};

// One ruled line per entry, like the skills above it: the school set large, the degree
// and what was studied under it, the period on the right when there is one.
export function EducationList({ entries, labelledBy }: EducationListProps) {
  // The text comes from the entries; only the dates are formatted in the page's language.
  const locale = useLocale();

  return (
    <ul aria-labelledby={labelledBy} className="border-t border-border">
      {entries.map(({ id, title, degree, description, period }, index) => (
        <li
          key={id}
          style={{ '--i': index }}
          className="grid reveal gap-2 border-b border-border py-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8"
        >
          <div className="flex flex-col gap-1">
            <h4 className="font-display text-h3 font-semibold">{title}</h4>
            {degree === undefined ? null : (
              <p lang="en" className="font-semibold text-fg">
                {degree}
              </p>
            )}
            <p className="text-fg-muted">{description}</p>
          </div>
          {period === undefined ? null : (
            <p className="text-small text-fg-muted tabular-nums md:pt-2 md:text-end">
              {formatPeriod(period, locale)}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
