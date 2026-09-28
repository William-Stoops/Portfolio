// Relative imports: the build scripts and vite.config.ts load this file with Node, which
// cannot resolve the `@/` alias.
import { DEFAULT_LOCALE, type Locale, type Localized } from '../i18n/locales.ts';
import { localeFromPathname } from '../i18n/locale-from-pathname.ts';

const PAGE_KEYS = ['home', 'behindTheScenes', 'accessibility', 'legalNotice', 'siteMap'] as const;

type PageKey = (typeof PAGE_KEYS)[number];

// Every page in each locale, slugs translated (ADR 0026). Never write a path by hand.
export const PAGE_PATHS = {
  fr: {
    home: '/fr',
    behindTheScenes: '/fr/coulisses',
    accessibility: '/fr/accessibilite',
    legalNotice: '/fr/mentions-legales',
    siteMap: '/fr/plan-du-site',
  },
  en: {
    home: '/en',
    behindTheScenes: '/en/behind-the-scenes',
    accessibility: '/en/accessibility',
    legalNotice: '/en/legal-notice',
    siteMap: '/en/site-map',
  },
} as const satisfies Localized<Record<PageKey, string>>;

const SECTION_KEYS = ['experience', 'aiPractice', 'skills', 'contact'] as const;

const JOURNEY_KEYS = ['korea', 'projects'] as const;

// Fragment ids of the home page sections, shared by the sections and the navigation. Their
// order is the page order, and it numbers them.
export const SECTION_IDS = {
  fr: {
    experience: 'parcours',
    aiPractice: 'ia',
    skills: 'competences',
    contact: 'contact',
  },
  en: {
    experience: 'journey',
    aiPractice: 'ai',
    skills: 'skills',
    contact: 'contact',
  },
} as const satisfies Localized<Record<(typeof SECTION_KEYS)[number], string>>;

// Fragment ids of stops inside the journey (the Parcours section), for links into it.
export const JOURNEY_ANCHORS = {
  fr: { korea: 'coree', projects: 'projets' },
  en: { korea: 'korea', projects: 'projects' },
} as const satisfies Localized<Record<(typeof JOURNEY_KEYS)[number], string>>;

// Every anchor a URL may carry in a locale, keyed the same way in each locale.
export function anchorsOf(locale: Locale): Readonly<Record<string, string>> {
  return { ...SECTION_IDS[locale], ...JOURNEY_ANCHORS[locale] };
}

// The same page, and the same section, in another locale: where the language switch leads.
// A section the other locale does not name is dropped; an unknown page leads home.
export function alternateHref(pathname: string, hash: string, target: Locale): string {
  const source = localeFromPathname(pathname) ?? DEFAULT_LOCALE;
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const page = PAGE_KEYS.find((key) => PAGE_PATHS[source][key] === path) ?? 'home';
  const sourceAnchors = anchorsOf(source);
  const anchor = [...SECTION_KEYS, ...JOURNEY_KEYS].find(
    (key) => sourceAnchors[key] === hash.replace(/^#/, ''),
  );
  const targetHash = anchor === undefined ? '' : `#${anchorsOf(target)[anchor] ?? ''}`;
  return `${PAGE_PATHS[target][page]}${targetHash}`;
}
