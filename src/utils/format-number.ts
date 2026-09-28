import { INTL_LOCALES, type Locale } from '@/i18n/locales';

// "1 500" in French (narrow no-break space), "1,500" in English; decimals as asked.
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], options).format(value);
}
