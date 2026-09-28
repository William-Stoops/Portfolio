import { describe, expect, it } from 'vitest';

import { localeFromPathname } from '@/i18n/locale-from-pathname';

describe('localeFromPathname', () => {
  it.each([
    ['/fr', 'fr'],
    ['/fr/', 'fr'],
    ['/fr/mentions-legales', 'fr'],
    ['/en', 'en'],
    ['/en/legal-notice', 'en'],
  ])('reads %s as %s', (pathname, expected) => {
    expect(localeFromPathname(pathname)).toBe(expected);
  });

  it.each(['/', '/de', '/english', '/frites/fr', ''])('finds no locale in %j', (pathname) => {
    expect(localeFromPathname(pathname)).toBeUndefined();
  });
});
