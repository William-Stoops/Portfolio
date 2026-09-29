import { createContext, use } from 'react';

import { DEFAULT_LOCALE, type Locale, type Localized } from '@/i18n/locales';

// One document, one locale (ADR 0026): main.tsx and entry-server.tsx provide the locale
// read from the URL, around the whole app. Outside a page (component tests), French.
export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function useLocale(): Locale {
  return use(LocaleContext);
}

// Interface text of shared components: a dictionary colocated with the component, both
// locales shipped (a few hundred bytes), read in the page's locale.
export function useLocalized<T>(dictionary: Localized<T>): T {
  return dictionary[useLocale()];
}
