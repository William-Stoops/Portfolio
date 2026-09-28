import { type Locale } from '../src/i18n/locales.ts';

type LocaleChoiceCase = {
  name: string;
  storedPreference: string | null;
  preferredLanguages: readonly string[];
  expected: Locale;
};

// How the gateway (scripts/locale-gateway.ts) chooses a locale, case by case.
export const LOCALE_CHOICE_CASES: readonly LocaleChoiceCase[] = [
  {
    name: 'a French browser',
    storedPreference: null,
    preferredLanguages: ['fr-FR', 'fr', 'en'],
    expected: 'fr',
  },
  {
    name: 'an English browser',
    storedPreference: null,
    preferredLanguages: ['en-US', 'en'],
    expected: 'en',
  },
  {
    name: 'a regional variant (en-GB)',
    storedPreference: null,
    preferredLanguages: ['en-GB'],
    expected: 'en',
  },
  {
    name: 'an upper-case tag (FR-CA)',
    storedPreference: null,
    preferredLanguages: ['FR-CA'],
    expected: 'fr',
  },
  {
    name: 'an unsupported first language, then English',
    storedPreference: null,
    preferredLanguages: ['de-DE', 'en-US', 'fr'],
    expected: 'en',
  },
  {
    name: 'only unsupported languages',
    storedPreference: null,
    preferredLanguages: ['ko-KR', 'de'],
    expected: 'fr',
  },
  {
    name: 'no language at all',
    storedPreference: null,
    preferredLanguages: [],
    expected: 'fr',
  },
  {
    name: 'a stored English choice over a French browser',
    storedPreference: 'en',
    preferredLanguages: ['fr-FR'],
    expected: 'en',
  },
  {
    name: 'a stored French choice over an English browser',
    storedPreference: 'fr',
    preferredLanguages: ['en-US'],
    expected: 'fr',
  },
  {
    name: 'a stored value that is not a locale',
    storedPreference: 'klingon',
    preferredLanguages: ['en-US'],
    expected: 'en',
  },
];
