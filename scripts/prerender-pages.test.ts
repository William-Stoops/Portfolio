import { matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/app/routes';

import { NOT_FOUND_PAGE, PRERENDERED_PAGES } from './prerender-pages.ts';

describe('prerendered pages', () => {
  // The client hydrates synchronously: a lazy route matched on first load would render
  // nothing until its chunk arrives, and the prerendered markup would not hydrate.
  it.each([...PRERENDERED_PAGES, NOT_FOUND_PAGE].map(({ path }) => path))(
    '%s matches no lazy route',
    (path) => {
      const lazyMatches = matchRoutes(ROUTES, path)?.filter(
        ({ route }) => route.lazy !== undefined,
      );

      expect(lazyMatches).toEqual([]);
    },
  );
});
