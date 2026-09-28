import { matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/app/routes';

import {
  GATEWAY_PAGE,
  localeOfPage,
  NOT_FOUND_PAGES,
  notFoundFileFor,
  PRERENDERED_PAGES,
} from './prerender-pages.ts';

describe('prerendered pages', () => {
  it('writes every page of both locales to its own file', () => {
    expect(PRERENDERED_PAGES).toEqual([
      { path: '/fr', file: 'fr.html' },
      { path: '/fr/accessibilite', file: 'fr/accessibilite.html' },
      { path: '/fr/mentions-legales', file: 'fr/mentions-legales.html' },
      { path: '/fr/plan-du-site', file: 'fr/plan-du-site.html' },
      { path: '/en', file: 'en.html' },
      { path: '/en/accessibility', file: 'en/accessibility.html' },
      { path: '/en/legal-notice', file: 'en/legal-notice.html' },
      { path: '/en/site-map', file: 'en/site-map.html' },
    ]);
    expect(GATEWAY_PAGE).toEqual({ path: '/', file: 'index.html' });
  });

  // The client hydrates synchronously: a lazy route matched on first load would render
  // nothing until its chunk arrives, and the prerendered markup would not hydrate.
  it.each([...PRERENDERED_PAGES, ...NOT_FOUND_PAGES].map(({ path }) => path))(
    '%s matches no lazy route',
    (path) => {
      const lazyMatches = matchRoutes(ROUTES, path)?.filter(
        ({ route }) => route.lazy !== undefined,
      );

      expect(lazyMatches).toEqual([]);
    },
  );

  it('answers an unknown address with the not-found page of its locale', () => {
    expect(notFoundFileFor('/en/nowhere')).toBe('en/404.html');
    expect(notFoundFileFor('/fr/nulle-part')).toBe('fr/404.html');
    expect(notFoundFileFor('/nulle-part')).toBe('404.html');
  });

  it('writes each page in the locale of its path, the root not-found page in French', () => {
    expect(localeOfPage('/en/legal-notice')).toBe('en');
    expect(localeOfPage('/fr')).toBe('fr');
    expect(localeOfPage('/404')).toBe('fr');
  });
});
