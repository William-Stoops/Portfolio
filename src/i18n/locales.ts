import * as z from 'zod/mini';

// French first: the language of the CV, the default, and the x-default of the gateway.
export const LOCALES = ['fr', 'en'] as const;

// Parses a locale at a boundary (URL segment, storage): never cast a string to Locale.
export const localeSchema = z.enum(LOCALES);

export type Locale = z.infer<typeof localeSchema>;

export const DEFAULT_LOCALE: Locale = 'fr';

// Every locale present, at compile time: adding one breaks each dictionary until it is
// translated.
export type Localized<T> = Readonly<Record<Locale, T>>;

// Intl needs a region to format dates and numbers the way its readers expect.
export const INTL_LOCALES = { fr: 'fr-FR', en: 'en-US' } as const satisfies Localized<string>;

// Each language named in itself, the way its readers look for it in a language switch.
export const LOCALE_NAMES = { fr: 'Français', en: 'English' } as const satisfies Localized<string>;
