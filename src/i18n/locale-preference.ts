// Type-only: scripts/locale-gateway.ts loads this file with Node, which cannot resolve `@/`.
import type { Locale } from '@/i18n/locales';

// A contract with the gateway's inline script (scripts/locale-gateway.ts), which reads it
// on the next visit to `/`.
export const LOCALE_STORAGE_KEY = 'locale-preference';

// Only an explicit choice is stored, never the language a visitor merely landed on.
export function storeLocalePreference(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    // Blocked storage only costs the memory of the choice: the switch still navigates.
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }
}
