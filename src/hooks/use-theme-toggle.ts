import { useState } from 'react';

import { type ThemePreference, useThemePreference } from '@/hooks/use-theme-preference';
import { useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { playSound } from '@/lib/play-sound';
import { runViewTransition } from '@/lib/view-transition';

const THEME_ANNOUNCEMENTS: Localized<Readonly<Record<ThemePreference, string>>> = {
  fr: {
    system: 'Thème du système activé',
    light: 'Thème clair activé',
    dark: 'Thème sombre activé',
  },
  en: { system: 'System theme on', light: 'Light theme on', dark: 'Dark theme on' },
};

// The new theme spreads in a circle from the pressed button: motion.css animates the
// transition typed "theme" from these coordinates, and nothing else (page changes cross-fade).
// Without typed View Transitions, or with reduced motion, the theme simply switches.
function switchTheme(apply: () => void, trigger: HTMLElement | undefined): void {
  if (trigger === undefined) {
    apply();
    return;
  }
  const { left, top, width, height } = trigger.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty('--theme-reveal-x', `${String(left + width / 2)}px`);
  root.style.setProperty('--theme-reveal-y', `${String(top + height / 2)}px`);
  runViewTransition('theme', () => {
    apply();
    return Promise.resolve();
  });
}

export function useThemeToggle(): {
  themePreference: ThemePreference;
  selectThemePreference: (themePreference: ThemePreference, trigger?: HTMLElement) => void;
  announcement: string;
} {
  const { themePreference, setThemePreference } = useThemePreference();
  const announcements = useLocalized(THEME_ANNOUNCEMENTS);
  // Empty until the visitor acts: a status message on mount would be noise (WCAG 4.1.3).
  const [announcement, setAnnouncement] = useState('');

  function selectThemePreference(
    nextThemePreference: ThemePreference,
    trigger?: HTMLElement,
  ): void {
    switchTheme(() => {
      setThemePreference(nextThemePreference);
    }, trigger);
    setAnnouncement(announcements[nextThemePreference]);
    playSound('tap');
  }

  return { themePreference, selectThemePreference, announcement };
}
