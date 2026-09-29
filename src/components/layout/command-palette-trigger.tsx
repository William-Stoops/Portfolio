import { Search } from 'lucide-react';
import { type RefObject } from 'react';

import { openCommandPalette, useCommandPalette } from '@/hooks/use-command-palette';
import { useShortcutLabel } from '@/hooks/use-shortcut-label';
import { useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { loadCommandPalette } from '@/lib/load-command-palette';

const TRIGGER_MESSAGES: Localized<{ label: (shortcut: string) => string }> = {
  fr: { label: (shortcut) => `Recherche rapide (${shortcut})` },
  en: { label: (shortcut) => `Quick search (${shortcut})` },
};

// Starts fetching the quick search's code as the visitor aims at its button: by the
// click, it is often there.
function preload(): void {
  void loadCommandPalette();
}

type CommandPaletteTriggerProps = {
  // In the site menu, the menu closes as the search opens (onOpen), taking this button with
  // it: the focus then goes back to the menu's own button when the search closes.
  onOpen?: () => void;
  returnFocusTo?: RefObject<HTMLElement | null>;
};

// The quick search's button, for those who do not know ⌘K. Its name says the shortcut;
// wide screens show it beside the icon.
export function CommandPaletteTrigger({ onOpen, returnFocusTo }: CommandPaletteTriggerProps) {
  const isOpen = useCommandPalette();
  const shortcut = useShortcutLabel();
  const messages = useLocalized(TRIGGER_MESSAGES);

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={(event) => {
        onOpen?.();
        openCommandPalette(returnFocusTo?.current ?? event.currentTarget);
      }}
      onPointerEnter={preload}
      onFocus={preload}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2.5 text-fg-muted transition-colors duration-150 hover:bg-surface-raised hover:text-fg"
    >
      <Search aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-5" />
      <span className="sr-only">{messages.label(shortcut)}</span>
      <kbd aria-hidden="true" className="hidden font-sans text-small xl:inline">
        {shortcut}
      </kbd>
    </button>
  );
}
