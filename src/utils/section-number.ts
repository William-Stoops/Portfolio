import { SECTION_IDS } from '@/config/paths';
import { LOCALES } from '@/i18n/locales';
import { formatTwoDigits } from '@/utils/format-two-digits';

// SECTION_IDS lists the home sections in page order, in each locale: their number follows
// from it, whatever the language of the id. The journey, the page's thread rather than a
// chapter, opens on its first year with no number: the chapters after it count from 01.
export function formatSectionNumber(sectionId: string): string | undefined {
  for (const locale of LOCALES) {
    const chapters = Object.entries<string>(SECTION_IDS[locale])
      .filter(([key]) => key !== 'experience')
      .map(([, id]) => id);
    const position = chapters.indexOf(sectionId);
    if (position !== -1) {
      return formatTwoDigits(position + 1);
    }
  }
  return undefined;
}
