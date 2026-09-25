import { type Period } from '@/types/period';

// UTC on both sides so the prerendered HTML and the hydrated client format the same date.
const MONTH_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatPoint(point: string): string {
  const [year = point, month] = point.split('-');
  if (month === undefined) {
    return year;
  }
  return MONTH_FORMAT.format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
}

export function formatPeriod({ start, end }: Period): string {
  if (end === undefined) {
    return `Depuis ${formatPoint(start)}`;
  }
  if (start === end) {
    return formatPoint(start);
  }
  return `${formatPoint(start)} – ${formatPoint(end)}`;
}
