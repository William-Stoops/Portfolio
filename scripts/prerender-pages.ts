import { PAGE_PATHS } from '../src/config/paths.ts';
import { DEFAULT_LOCALE, LOCALES } from '../src/i18n/locales.ts';
import { localeFromPathname } from '../src/i18n/locale-from-pathname.ts';

type PrerenderedPage = { path: string; file: string };

// Every page of every locale, written to static HTML at build time by scripts/prerender.ts.
// `fr/mentions-legales.html` is served at `/fr/mentions-legales` by Cloudflare Pages (and
// by `vite preview`, see vite.config.ts), without a trailing-slash redirect.
export const PRERENDERED_PAGES: readonly PrerenderedPage[] = LOCALES.flatMap((locale) =>
  Object.values(PAGE_PATHS[locale]).map((path) => ({ path, file: `${path.slice(1)}.html` })),
);

// `/`, the x-default: a static page that picks the locale (scripts/locale-gateway.ts).
export const GATEWAY_PAGE = { path: '/', file: 'index.html' } as const;

// The host serves the nearest 404.html up the requested path, with a 404 status: an
// unknown URL under a locale reads its language, any other the default one. No "soft 404"
// where an unknown URL answers 200 with a page.
export const NOT_FOUND_PAGES: readonly PrerenderedPage[] = [
  ...LOCALES.map((locale) => ({ path: `/${locale}/404`, file: `${locale}/404.html` })),
  { path: '/404', file: '404.html' },
];

export function notFoundFileFor(pathname: string): string {
  const locale = localeFromPathname(pathname);
  return locale === undefined ? '404.html' : `${locale}/404.html`;
}

// The locale a prerendered page is written in: its path's, else the default.
export function localeOfPage(path: string): (typeof LOCALES)[number] {
  return localeFromPathname(path) ?? DEFAULT_LOCALE;
}
