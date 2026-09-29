import { type Localized } from '@/i18n/locales';

// Read after the name of a link that opens a new tab (WCAG 3.2.5), visually hidden.
export const NEW_TAB_HINT = {
  fr: ' (nouvel onglet)',
  en: ' (new tab)',
} as const satisfies Localized<string>;
