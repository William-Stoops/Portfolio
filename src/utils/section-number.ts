import { SECTION_IDS } from '@/config/paths';

// SECTION_IDS lists the home sections in page order: their number follows from it.
const SECTION_ORDER: readonly string[] = Object.values(SECTION_IDS);

export function formatSectionNumber(sectionId: string): string | undefined {
  const position = SECTION_ORDER.indexOf(sectionId);
  return position === -1 ? undefined : String(position + 1).padStart(2, '0');
}
