import { INTL_LOCALES, type Locale, type Localized } from '@/i18n/locales';
import { type Period } from '@/types/period';

// UTC on both sides so the prerendered HTML and the hydrated client format the same date.
const MONTH_FORMATS: Localized<Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat(INTL_LOCALES.fr, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }),
  en: new Intl.DateTimeFormat(INTL_LOCALES.en, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }),
};

// An ongoing activity, as each language says it.
const ONGOING: Localized<(start: string) => string> = {
  fr: (start) => `Depuis ${start}`,
  en: (start) => `Since ${start}`,
};

function formatPoint(point: string, locale: Locale): string {
  const [year = point, month] = point.split('-');
  if (month === undefined) {
    return year;
  }
  return MONTH_FORMATS[locale].format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
}

export function formatPeriod({ start, end }: Period, locale: Locale): string {
  if (end === undefined) {
    return ONGOING[locale](formatPoint(start, locale));
  }
  if (start === end) {
    return formatPoint(start, locale);
  }
  return `${formatPoint(start, locale)} – ${formatPoint(end, locale)}`;
}
