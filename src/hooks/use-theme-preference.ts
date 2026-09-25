import { useSyncExternalStore } from 'react';
import * as z from 'zod/mini';

// Keep in sync with the inline script in index.html, which applies the stored preference
// before first paint so the page never flashes the wrong theme.
const THEME_STORAGE_KEY = 'theme-preference';
const THEME_ATTRIBUTE = 'data-theme';
const THEME_CHANGE_EVENT = 'theme-preference-change';

// zod/mini: this runs on every page, where full Zod would cost ~10 kB brotli.
const themePreferenceSchema = z.enum(['system', 'light', 'dark']);

export type ThemePreference = z.infer<typeof themePreferenceSchema>;

// Anything missing or unexpected (hand-edited storage, stale values) means "system".
function parseThemePreference(value: string | null): ThemePreference {
  const result = themePreferenceSchema.safeParse(value);
  return result.success ? result.data : 'system';
}

// The attribute on <html> is the source of truth, not storage: it stays correct for the
// session even when storage is blocked (private mode, disabled site data).
function readThemePreference(): ThemePreference {
  return parseThemePreference(document.documentElement.getAttribute(THEME_ATTRIBUTE));
}

function applyThemePreference(themePreference: ThemePreference): void {
  if (themePreference === 'system') {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  } else {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, themePreference);
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function persistThemePreference(themePreference: ThemePreference): void {
  try {
    if (themePreference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    }
  } catch (error) {
    // Blocked storage only costs persistence across visits; the choice still applies now.
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }
}

function setThemePreference(themePreference: ThemePreference): void {
  persistThemePreference(themePreference);
  applyThemePreference(themePreference);
}

function handleStorage(event: StorageEvent): void {
  if (event.key === THEME_STORAGE_KEY) {
    applyThemePreference(parseThemePreference(event.newValue));
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', handleStorage);
  };
}

export function useThemePreference(): {
  themePreference: ThemePreference;
  setThemePreference: (themePreference: ThemePreference) => void;
} {
  const themePreference = useSyncExternalStore(subscribe, readThemePreference);
  return { themePreference, setThemePreference };
}
