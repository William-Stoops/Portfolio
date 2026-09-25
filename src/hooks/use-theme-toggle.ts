import { useState } from 'react';

import { type ThemePreference, useThemePreference } from '@/hooks/use-theme-preference';

const THEME_ANNOUNCEMENTS: Readonly<Record<ThemePreference, string>> = {
  system: 'Thème du système activé',
  light: 'Thème clair activé',
  dark: 'Thème sombre activé',
};

export function useThemeToggle(): {
  themePreference: ThemePreference;
  selectThemePreference: (themePreference: ThemePreference) => void;
  announcement: string;
} {
  const { themePreference, setThemePreference } = useThemePreference();
  // Empty until the visitor acts: a status message on mount would be noise (WCAG 4.1.3).
  const [announcement, setAnnouncement] = useState('');

  function selectThemePreference(nextThemePreference: ThemePreference): void {
    setThemePreference(nextThemePreference);
    setAnnouncement(THEME_ANNOUNCEMENTS[nextThemePreference]);
  }

  return { themePreference, selectThemePreference, announcement };
}
