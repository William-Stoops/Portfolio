import { type LucideIcon, Monitor, Moon, Sun } from 'lucide-react';

import { type ThemePreference } from '@/hooks/use-theme-preference';
import { useThemeToggle } from '@/hooks/use-theme-toggle';

type ThemeOption = { value: ThemePreference; label: string; Icon: LucideIcon };

const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: 'system', label: 'Thème du système', Icon: Monitor },
  { value: 'light', label: 'Thème clair', Icon: Sun },
  { value: 'dark', label: 'Thème sombre', Icon: Moon },
];

export function ThemeToggle() {
  const { themePreference, selectThemePreference, announcement } = useThemeToggle();

  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">Thème</legend>
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
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
          <span className="sr-only">{label}</span>
        </button>
      ))}
      {/* aria-live is implicit on <output>, but not every screen reader honours it. */}
      <output aria-live="polite" className="sr-only">
        {announcement}
      </output>
    </fieldset>
  );
}
