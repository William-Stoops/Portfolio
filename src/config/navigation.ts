import { PATHS, SECTION_IDS } from '@/config/paths';

type NavItem = { label: string; href: string };

// Plain fragment links (`/#id`), not router links: the browser scrolls to the section and
// moves the sequential focus starting point to it, from any page of the site.
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'À propos', href: `${PATHS.home}#${SECTION_IDS.about}` },
  { label: 'Parcours', href: `${PATHS.home}#${SECTION_IDS.experience}` },
  { label: 'Projets', href: `${PATHS.home}#${SECTION_IDS.projects}` },
  { label: 'IA', href: `${PATHS.home}#${SECTION_IDS.aiPractice}` },
  { label: 'Compétences', href: `${PATHS.home}#${SECTION_IDS.skills}` },
  { label: 'Contact', href: `${PATHS.home}#${SECTION_IDS.contact}` },
];
