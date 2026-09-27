import { PAGE_PATHS, SECTION_IDS } from '@/config/paths';
import { type Locale, type Localized } from '@/i18n/locales';

export type NavItem = { label: string; href: string };

export type PageLink = { label: string; path: string };

const SECTION_LABELS = {
  fr: {
    about: 'À propos',
    experience: 'Parcours',
    aiPractice: 'IA',
    skills: 'Compétences',
    contact: 'Contact',
  },
  en: {
    about: 'About',
    experience: 'Journey',
    aiPractice: 'AI',
    skills: 'Skills',
    contact: 'Contact',
  },
} as const satisfies Localized<Record<keyof (typeof SECTION_IDS)[Locale], string>>;

const PAGE_LABELS = {
  fr: { accessibility: 'Accessibilité', legalNotice: 'Mentions légales', siteMap: 'Plan du site' },
  en: { accessibility: 'Accessibility', legalNotice: 'Legal notice', siteMap: 'Site map' },
} as const satisfies Localized<Record<string, string>>;

// One link per numbered section of the home page (Seoul and STAXX are stops within the
// journey). Plain fragment links, not router links: the browser scrolls to the section and
// moves the sequential focus starting point to it, from any page of the site.
function navItemsIn(locale: Locale): readonly NavItem[] {
  const home = PAGE_PATHS[locale].home;
  const ids = SECTION_IDS[locale];
  const labels = SECTION_LABELS[locale];
  return [
    { label: labels.about, href: `${home}#${ids.about}` },
    { label: labels.experience, href: `${home}#${ids.experience}` },
    { label: labels.aiPractice, href: `${home}#${ids.aiPractice}` },
    { label: labels.skills, href: `${home}#${ids.skills}` },
    { label: labels.contact, href: `${home}#${ids.contact}` },
  ];
}

// Pages outside the home page, linked from the footer and listed in the site map.
function footerLinksIn(locale: Locale): readonly PageLink[] {
  const paths = PAGE_PATHS[locale];
  const labels = PAGE_LABELS[locale];
  return [
    { label: labels.accessibility, path: paths.accessibility },
    { label: labels.legalNotice, path: paths.legalNotice },
    { label: labels.siteMap, path: paths.siteMap },
  ];
}

export const NAV_ITEMS: Localized<readonly NavItem[]> = {
  fr: navItemsIn('fr'),
  en: navItemsIn('en'),
};

export const FOOTER_LINKS: Localized<readonly PageLink[]> = {
  fr: footerLinksIn('fr'),
  en: footerLinksIn('en'),
};
