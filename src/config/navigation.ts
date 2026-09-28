import { JOURNEY_ANCHORS, PATHS, SECTION_IDS } from '@/config/paths';

type NavItem = { label: string; href: string };

// Plain fragment links (`/#id`), not router links: the browser scrolls to the section and
// moves the sequential focus starting point to it, from any page of the site.
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'À propos', href: `${PATHS.home}#${SECTION_IDS.about}` },
  { label: 'Parcours', href: `${PATHS.home}#${SECTION_IDS.experience}` },
  { label: 'Corée', href: `${PATHS.home}#${JOURNEY_ANCHORS.korea}` },
  { label: 'Projets', href: `${PATHS.home}#${JOURNEY_ANCHORS.projects}` },
  { label: 'IA', href: `${PATHS.home}#${SECTION_IDS.aiPractice}` },
  { label: 'Compétences', href: `${PATHS.home}#${SECTION_IDS.skills}` },
  { label: 'Contact', href: `${PATHS.home}#${SECTION_IDS.contact}` },
];

type PageLink = { label: string; path: string };

// Pages outside the home page, linked from the footer and listed in the site map.
export const FOOTER_LINKS: readonly PageLink[] = [
  { label: 'Accessibilité', path: PATHS.accessibility },
  { label: 'Mentions légales', path: PATHS.legalNotice },
  { label: 'Plan du site', path: PATHS.siteMap },
];
