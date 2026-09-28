import { PAGE_PATHS, SECTION_IDS } from '@/config/paths';
import { type Locale, type Localized } from '@/i18n/locales';

export type NavItem = { label: string; href: string };

export type PageLink = { label: string; path: string };

const SECTION_LABELS = {
  fr: {
    experience: 'Parcours',
    aiPractice: 'IA',
    skills: 'Compétences',
    contact: 'Contact',
  },
  en: {
    experience: 'Journey',
    aiPractice: 'AI',
    skills: 'Skills',
    contact: 'Contact',
  },
} as const satisfies Localized<Record<keyof (typeof SECTION_IDS)[Locale], string>>;

const PAGE_LABELS = {
  fr: {
    home: 'Accueil',
    behindTheScenes: 'Coulisses',
    legalNotice: 'Mentions légales',
    siteMap: 'Plan du site',
  },
  en: {
    home: 'Home',
    behindTheScenes: 'Behind the scenes',
    legalNotice: 'Legal notice',
    siteMap: 'Site map',
  },
} as const satisfies Localized<Record<string, string>>;

// One link per numbered section of the home page (Seoul and STAXX are stops within the
// journey). Plain fragment links, not router links: the browser scrolls to the section and
// moves the sequential focus starting point to it, from any page of the site.
function navItemsIn(locale: Locale): readonly NavItem[] {
  const home = PAGE_PATHS[locale].home;
  const ids = SECTION_IDS[locale];
  const labels = SECTION_LABELS[locale];
  return [
    { label: labels.experience, href: `${home}#${ids.experience}` },
    { label: labels.aiPractice, href: `${home}#${ids.aiPractice}` },
    { label: labels.skills, href: `${home}#${ids.skills}` },
    { label: labels.contact, href: `${home}#${ids.contact}` },
  ];
}

// Pages outside the home page, linked from the footer and listed in the site map: how the
// site is made first, for the readers of its code.
function footerLinksIn(locale: Locale): readonly PageLink[] {
  const paths = PAGE_PATHS[locale];
  const labels = PAGE_LABELS[locale];
  return [
    { label: labels.behindTheScenes, path: paths.behindTheScenes },
    { label: labels.legalNotice, path: paths.legalNotice },
    { label: labels.siteMap, path: paths.siteMap },
  ];
}

function homeLinkIn(locale: Locale): PageLink {
  return { label: PAGE_LABELS[locale].home, path: PAGE_PATHS[locale].home };
}

// Where the not-found page sends a visitor who lost their way: back home, into the story,
// straight to the way to reach William, or to the map of everything.
function detoursIn(locale: Locale): readonly (NavItem | PageLink)[] {
  const paths = PAGE_PATHS[locale];
  const ids = SECTION_IDS[locale];
  const sections = SECTION_LABELS[locale];
  const pages = PAGE_LABELS[locale];
  return [
    homeLinkIn(locale),
    { label: sections.experience, href: `${paths.home}#${ids.experience}` },
    { label: sections.contact, href: `${paths.home}#${ids.contact}` },
    { label: pages.siteMap, path: paths.siteMap },
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

export const DETOURS: Localized<readonly (NavItem | PageLink)[]> = {
  fr: detoursIn('fr'),
  en: detoursIn('en'),
};

// The home page, by name: the not-found page and the quick search lead back to it.
export const HOME_LINK: Localized<PageLink> = {
  fr: homeLinkIn('fr'),
  en: homeLinkIn('en'),
};
