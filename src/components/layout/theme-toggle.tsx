import { type LucideIcon, Monitor, Moon, Sun } from 'lucide-react';

import { type ThemePreference } from '@/hooks/use-theme-preference';
import { useThemeToggle } from '@/hooks/use-theme-toggle';
import { useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';

type ThemeOption = { value: ThemePreference; Icon: LucideIcon };

const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: 'system', Icon: Monitor },
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
];

type ThemeToggleMessages = { legend: string; options: Readonly<Record<ThemePreference, string>> };

const THEME_TOGGLE_MESSAGES: Localized<ThemeToggleMessages> = {
  fr: {
    legend: 'Thème',
    options: { system: 'Thème du système', light: 'Thème clair', dark: 'Thème sombre' },
  },
  en: {
    legend: 'Theme',
    options: { system: 'System theme', light: 'Light theme', dark: 'Dark theme' },
  },
};

export function ThemeToggle() {
  const { themePreference, selectThemePreference, announcement } = useThemeToggle();
  const messages = useLocalized(THEME_TOGGLE_MESSAGES);

  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">{messages.legend}</legend>
      {THEME_OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={themePreference === value}
          onClick={(event) => {
            selectThemePreference(value, event.currentTarget);
          }}
          className="inline-grid size-11 place-items-center rounded-md border-2 border-transparent text-fg-muted transition-colors duration-150 hover:text-fg aria-pressed:border-accent aria-pressed:bg-surface-raised aria-pressed:text-fg"
        >
          <Icon aria-hidden="true" focusable="false" className="size-5" strokeWidth={1.75} />
          <span className="sr-only">{messages.options[value]}</span>
        </button>
      ))}
      {/* aria-live is implicit on <output>, but not every screen reader honours it. */}
      <output aria-live="polite" className="sr-only">
        {announcement}
      </output>
    </fieldset>
  );
}
