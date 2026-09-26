import { useState } from 'react';

import { type ThemePreference, useThemePreference } from '@/hooks/use-theme-preference';

const THEME_ANNOUNCEMENTS: Readonly<Record<ThemePreference, string>> = {
  system: 'Thème du système activé',
  light: 'Thème clair activé',
  dark: 'Thème sombre activé',
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// A transition interrupted by the next one (a quick second choice), or started in a hidden
// tab, rejects its `ready` promise: expected, the theme still switches. Anything else is a
// real error.
async function settleTransition(transition: ViewTransition): Promise<void> {
  try {
    await transition.ready;
  } catch (error) {
    const isExpected =
      error instanceof DOMException &&
      (error.name === 'AbortError' || error.name === 'InvalidStateError');
    if (!isExpected) {
      throw error;
    }
  }
}

// The new theme spreads in a circle from the pressed button (motion.css animates the view
// transition's clip-path from these coordinates). Without View Transitions support, or
// with reduced motion, the theme simply switches.
function switchTheme(apply: () => void, trigger: HTMLElement | undefined): void {
  if (trigger === undefined || !('startViewTransition' in document) || prefersReducedMotion()) {
    apply();
    return;
  }
  const { left, top, width, height } = trigger.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty('--theme-reveal-x', `${String(left + width / 2)}px`);
  root.style.setProperty('--theme-reveal-y', `${String(top + height / 2)}px`);
  void settleTransition(document.startViewTransition(apply));
}

export function useThemeToggle(): {
  themePreference: ThemePreference;
  selectThemePreference: (themePreference: ThemePreference, trigger?: HTMLElement) => void;
  announcement: string;
} {
  const { themePreference, setThemePreference } = useThemePreference();
  // Empty until the visitor acts: a status message on mount would be noise (WCAG 4.1.3).
  const [announcement, setAnnouncement] = useState('');

  function selectThemePreference(
    nextThemePreference: ThemePreference,
    trigger?: HTMLElement,
  ): void {
    switchTheme(() => {
      setThemePreference(nextThemePreference);
    }, trigger);
    setAnnouncement(THEME_ANNOUNCEMENTS[nextThemePreference]);
  }

  return { themePreference, selectThemePreference, announcement };
}
