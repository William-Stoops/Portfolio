import { SECTION_IDS } from '@/config/paths';
import { formatTwoDigits } from '@/utils/format-two-digits';

// SECTION_IDS lists the home sections in page order: their number follows from it.
const SECTION_ORDER: readonly string[] = Object.values(SECTION_IDS);

export function formatSectionNumber(sectionId: string): string | undefined {
  const position = SECTION_ORDER.indexOf(sectionId);
  return position === -1 ? undefined : formatTwoDigits(position + 1);
}
