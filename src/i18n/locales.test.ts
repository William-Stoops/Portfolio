import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, INTL_LOCALES, LOCALE_NAMES, LOCALES } from '@/i18n/locales';

describe('locales', () => {
  it('offers French, the language of the CV and the default, then English', () => {
    expect(LOCALES).toEqual(['fr', 'en']);
    expect(DEFAULT_LOCALE).toBe('fr');
  });

  it('formats each locale with a canonical, region-specific Intl tag', () => {
    expect(INTL_LOCALES).toEqual({ fr: 'fr-FR', en: 'en-US' });
    for (const tag of Object.values(INTL_LOCALES)) {
      expect(Intl.getCanonicalLocales(tag)).toEqual([tag]);
    }
  });

  it('names each language in that language, as its readers look for it', () => {
    expect(LOCALE_NAMES).toEqual({ fr: 'Français', en: 'English' });
  });
});
