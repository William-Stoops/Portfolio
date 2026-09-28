import { SECTION_IDS } from '@/config/paths';
import { LOCALES } from '@/i18n/locales';
import { formatTwoDigits } from '@/utils/format-two-digits';

// SECTION_IDS lists the home sections in page order, in each locale: their number follows
// from it, whatever the language of the id.
export function formatSectionNumber(sectionId: string): string | undefined {
  for (const locale of LOCALES) {
    const position = Object.values<string>(SECTION_IDS[locale]).indexOf(sectionId);
    if (position !== -1) {
      return formatTwoDigits(position + 1);
    }
  }
  return undefined;
}
