import { runInNewContext } from 'node:vm';

import { describe, expect, it } from 'vitest';

import { LOCALE_CHOICE_CASES } from './locale-choice-cases.ts';
import { renderLocaleGateway } from './locale-gateway.ts';

const PAGE = renderLocaleGateway();
const INLINE_SCRIPT = /<script>([\s\S]*?)<\/script>/.exec(PAGE)?.[1] ?? '';

type Visit = {
  storedPreference?: string | null;
  preferredLanguages?: readonly string[];
  hash?: string;
  search?: string;
  isStorageBlocked?: boolean;
};

// Runs the gateway's inline script as a browser would, and returns where it sends the
// visitor.
function visitGateway({
  storedPreference = null,
  preferredLanguages = ['fr-FR'],
  hash = '',
  search = '',
  isStorageBlocked = false,
}: Visit): string {
  const destinations: string[] = [];
  runInNewContext(INLINE_SCRIPT, {
    localStorage: {
      getItem: (key: string): string | null => {
        if (isStorageBlocked) {
          throw new Error('SecurityError');
        }
        return key === 'locale-preference' ? storedPreference : null;
      },
    },
    navigator: { languages: preferredLanguages, language: preferredLanguages[0] },
    location: {
      hash,
      search,
      replace: (url: string) => {
        destinations.push(url);
      },
    },
  });
  return destinations.join(' ');
}

describe('locale gateway', () => {
  it.each(LOCALE_CHOICE_CASES)(
    'sends $name to /$expected',
    ({ storedPreference, preferredLanguages, expected }) => {
      expect(visitGateway({ storedPreference, preferredLanguages })).toBe(`/${expected}`);
    },
  );

  it('keeps the query string and carries a known section over to the chosen locale', () => {
    expect(
      visitGateway({ preferredLanguages: ['en-US'], hash: '#parcours', search: '?ref=cv' }),
    ).toBe('/en?ref=cv#journey');
    expect(visitGateway({ preferredLanguages: ['fr-FR'], hash: '#contact' })).toBe('/fr#contact');
  });

  it('drops an anchor no locale knows', () => {
    expect(visitGateway({ preferredLanguages: ['fr-FR'], hash: '#nulle-part' })).toBe('/fr');
  });

  it('follows the browser when storage is blocked', () => {
    expect(visitGateway({ preferredLanguages: ['en-US'], isStorageBlocked: true })).toBe('/en');
  });

  it('sends visitors without JavaScript to French, and offers both languages', () => {
    expect(PAGE).toContain('<noscript><meta http-equiv="refresh" content="0; url=/fr"></noscript>');
    expect(PAGE).toContain('<a href="/fr" hreflang="fr" lang="fr">Français</a>');
    expect(PAGE).toContain('<a href="/en" hreflang="en" lang="en">English</a>');
  });

  it('points crawlers at both languages, and at itself as the default', () => {
    const page = renderLocaleGateway();

    expect(page).toContain('<link rel="canonical" href="https://william-stoops.pages.dev/">');
    expect(page).toContain('hreflang="en" href="https://william-stoops.pages.dev/en"');
    expect(page).toContain('hreflang="x-default" href="https://william-stoops.pages.dev/"');
  });

  it('is a small page of its own, without the app bundle', () => {
    expect(PAGE).not.toContain('type="module"');
    // Its script, its fallback links and the addresses crawlers read (ADR 0031).
    expect(new TextEncoder().encode(PAGE).length).toBeLessThan(2560);
  });
});
