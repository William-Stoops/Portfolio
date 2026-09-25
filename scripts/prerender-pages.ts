import { PATHS } from '../src/config/paths.ts';

// Routable pages written to static HTML at build time by scripts/prerender.ts.
// `<name>.html` is served at `/<name>` by Cloudflare Pages (and by `vite preview`, see
// vite.config.ts), without a trailing-slash redirect.
export const PRERENDERED_PAGES = [
  { path: PATHS.home, file: 'index.html' },
  { path: PATHS.accessibility, file: 'accessibilite.html' },
  { path: PATHS.legalNotice, file: 'mentions-legales.html' },
  { path: PATHS.siteMap, file: 'plan-du-site.html' },
] as const;

// Served for every other URL with a 404 status, by the host and by `vite preview`: no
// "soft 404" where an unknown URL answers 200 with the home page.
export const NOT_FOUND_PAGE = { path: '/404', file: '404.html' } as const;
