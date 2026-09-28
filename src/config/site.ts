// Type-only: scripts/locale-gateway.ts loads this file with Node, which cannot resolve `@/`.
import type { Localized } from '@/i18n/locales';

// Identity shown in the page chrome (header, footer, titles). Source: docs/content/cv-source.md.
export const SITE_OWNER = 'William Stoops';
export const SITE_TITLE = 'William Stoops – Software Engineer & AI Engineer';
export const SITE_ROLE = 'Software Engineer & AI Engineer';
// The profile sentence of the CV: the hero's tagline and the footer's sign-off.
export const SITE_TAGLINE = {
  fr: 'Je décide d’une architecture, je la mesure, je la livre.',
  en: 'I choose an architecture, I measure it, I ship it.',
} as const satisfies Localized<string>;
// Where the site is served (Cloudflare Pages, ADR 0031): absolute URLs for crawlers and link
// previews (canonical, alternates, Open Graph, sitemap).
export const SITE_ORIGIN = 'https://william-stoops.pages.dev';
export const CONTACT_EMAIL = 'william.stoops@epitech.eu';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/william-stoops-a1029b233';

// Served from public/. The CV exists in French only, and the English label says so. The
// weight in the labels is checked against the real file by E2E.
export const CV_FILE = {
  href: '/cv/william-stoops-cv-fr.pdf',
  details: { fr: 'PDF, 56 Ko', en: 'PDF in French, 56 KB' },
} as const satisfies { href: string; details: Localized<string> };

// Host named in the legal notice (LCEN art. 6). Source: Cloudflare, Inc. annual report
// (SEC form 10-K, fiscal year 2025), cover page.
export const HOSTING_PROVIDER = {
  name: 'Cloudflare, Inc.',
  address: {
    fr: '101 Townsend Street, San Francisco, California 94107, États-Unis',
    en: '101 Townsend Street, San Francisco, California 94107, United States',
  },
  phone: '+1 888 993 5273',
  website: 'https://www.cloudflare.com',
} as const satisfies {
  name: string;
  address: Localized<string>;
  phone: string;
  website: string;
};
