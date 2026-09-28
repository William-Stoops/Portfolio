import { type KeyboardEvent, type RefObject, useRef, useState } from 'react';

import { type PaletteEntry, type PaletteGroup } from '@/hooks/use-palette-commands';
import { matchesQuery } from '@/utils/matches-query';

const GROUPS = ['sections', 'pages', 'actions'] as const satisfies readonly PaletteGroup[];

// Marks the results the arrows move through, in reading order.
const RESULT_SELECTOR = '[data-palette-result]';

type PaletteResults = { group: PaletteGroup; entries: readonly PaletteEntry[] };

// The search of the quick search, a field over lists of real links and buttons: what is
// typed narrows the entries (matchesQuery, accents aside), the down arrow goes from the
// field to the first result and on through the others (the up arrow from the first comes
// back to the field), and Enter in the field follows the first result. The focus is the
// active result: no ARIA to keep in sync, and each result keeps its own semantics.
export function usePaletteSearch(
  entries: readonly PaletteEntry[],
  fieldRef: RefObject<HTMLInputElement | null>,
): {
  query: string;
  changeQuery: (query: string) => void;
  results: readonly PaletteResults[];
  count: number;
  resultsRef: RefObject<HTMLDivElement | null>;
  handleFieldKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleResultKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
} {
  const [query, setQuery] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Entries come grouped, so filtering keeps the order the lists show them in.
  const matches = entries.filter(({ label, keywords }) =>
    matchesQuery(`${label} ${keywords}`, query),
  );
  const results = GROUPS.map((group) => ({
    group,
    entries: matches.filter((entry) => entry.group === group),
  })).filter((found) => found.entries.length > 0);

  function resultElements(): HTMLElement[] {
    return [...(resultsRef.current?.querySelectorAll<HTMLElement>(RESULT_SELECTOR) ?? [])];
  }

  function handleFieldKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const [first] = resultElements();
    if (first === undefined) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      first.focus();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      first.click();
    }
  }

  function handleResultKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    const elements = resultElements();
    const position = elements.indexOf(event.currentTarget);
    const next =
      event.key === 'ArrowDown'
        ? (elements[position + 1] ?? elements[0])
        : (elements[position - 1] ?? fieldRef.current);
    next?.focus();
  }

  return {
    query,
    changeQuery: setQuery,
    results,
    count: matches.length,
    resultsRef,
    handleFieldKeyDown,
    handleResultKeyDown,
  };
}
