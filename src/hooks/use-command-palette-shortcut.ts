import { useEffect } from 'react';

import { toggleCommandPalette } from '@/hooks/use-command-palette';

// ⌘K on a Mac, Ctrl+K elsewhere: the shortcut web applications use for a quick search. A
// modifier is always held, so typing never triggers it (WCAG 2.1.4); with Shift or Alt
// the keys stay the browser's.
function isShortcut(event: KeyboardEvent): boolean {
  return (
    (event.metaKey || event.ctrlKey) &&
    !event.shiftKey &&
    !event.altKey &&
    event.key.toLowerCase() === 'k'
  );
}

// Opens the quick search from anywhere on the page, and closes it the same way.
export function useCommandPaletteShortcut(): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (isShortcut(event)) {
        event.preventDefault();
        toggleCommandPalette();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
