import { describe, expect, it } from 'vitest';

import { alternateHref, JOURNEY_ANCHORS, PAGE_PATHS, SECTION_IDS } from '@/config/paths';
import { type Locale, LOCALES } from '@/i18n/locales';

const ALL_PATHS = LOCALES.flatMap((locale) => Object.values(PAGE_PATHS[locale]));

describe('PAGE_PATHS', () => {
  it('translates every page, under its locale', () => {
    expect(PAGE_PATHS).toEqual({
      fr: {
        home: '/fr',
        behindTheScenes: '/fr/coulisses',
        legalNotice: '/fr/mentions-legales',
        siteMap: '/fr/plan-du-site',
      },
      en: {
        home: '/en',
        behindTheScenes: '/en/behind-the-scenes',
        legalNotice: '/en/legal-notice',
        siteMap: '/en/site-map',
      },
    });
  });

  it('gives each page its own path', () => {
    expect(new Set(ALL_PATHS).size).toBe(ALL_PATHS.length);
  });
});

describe('anchors', () => {
  it('translates the section and journey anchors, the same keys in each locale', () => {
    expect(SECTION_IDS.en).toEqual({
      experience: 'journey',
      aiPractice: 'ai',
      skills: 'skills',
      contact: 'contact',
    });
    expect(Object.keys(SECTION_IDS.fr)).toEqual(Object.keys(SECTION_IDS.en));
    expect(JOURNEY_ANCHORS).toEqual({
      fr: { korea: 'coree', projects: 'projets' },
      en: { korea: 'korea', projects: 'projects' },
    });
  });

  it('keeps anchors unique within a page', () => {
    for (const locale of LOCALES) {
      const anchors = [
        ...Object.values(SECTION_IDS[locale]),
        ...Object.values(JOURNEY_ANCHORS[locale]),
      ];
      expect(new Set(anchors).size).toBe(anchors.length);
    }
  });
});

describe('alternateHref', () => {
  it.each<{ pathname: string; target: Locale; expected: string }>([
    { pathname: '/fr', target: 'en', expected: '/en' },
    { pathname: '/en', target: 'fr', expected: '/fr' },
    { pathname: '/fr/mentions-legales', target: 'en', expected: '/en/legal-notice' },
    { pathname: '/en/site-map', target: 'fr', expected: '/fr/plan-du-site' },
    { pathname: '/fr/coulisses', target: 'en', expected: '/en/behind-the-scenes' },
    { pathname: '/fr/plan-du-site/', target: 'en', expected: '/en/site-map' },
  ])(
    'leads from $pathname to the same page in $target: $expected',
    ({ pathname, target, expected }) => {
      expect(alternateHref(pathname, '', target)).toBe(expected);
    },
  );

  it.each([
    ['#parcours', '#journey'],
    ['#coree', '#korea'],
    ['#projets', '#projects'],
    ['#contact', '#contact'],
  ])('carries the French section %s over as %s', (hash, expected) => {
    expect(alternateHref('/fr', hash, 'en')).toBe(`/en${expected}`);
  });

  it('drops an anchor the other locale does not know', () => {
    expect(alternateHref('/fr', '#annee-2021', 'en')).toBe('/en');
  });

  it('leads from an unknown page to the other locale’s home', () => {
    expect(alternateHref('/fr/page-inexistante', '', 'en')).toBe('/en');
    expect(alternateHref('/inconnue', '', 'en')).toBe('/en');
  });
});
