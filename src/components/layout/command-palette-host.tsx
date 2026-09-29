import { Search, X } from 'lucide-react';
import { lazy, Suspense } from 'react';

import { useCommandPalette } from '@/hooks/use-command-palette';
import { loadCommandPalette } from '@/lib/load-command-palette';

const ICONS = {
  search: (
    <Search
      aria-hidden="true"
      focusable="false"
      strokeWidth={1.75}
      className="size-5 shrink-0 text-fg-muted"
    />
  ),
  close: <X aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-5" />,
};

const CommandPalette = lazy(() =>
  loadCommandPalette().then(({ CommandPalette: palette }) => ({ default: palette })),
);

// Where the quick search appears, once asked for: its code loads on the first opening, and
// it is mounted only while open, so every opening starts from an empty search.
export function CommandPaletteHost() {
  const isOpen = useCommandPalette();

  return isOpen ? (
    <Suspense>
      <CommandPalette icons={ICONS} />
    </Suspense>
  ) : null;
}
