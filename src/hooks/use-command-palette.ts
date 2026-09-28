import { useSyncExternalStore } from 'react';

import { playSound } from '@/lib/play-sound';

// Whether the quick search is open (ADR 0034): one state for the page, set by its header
// button and by ⌘K / Ctrl+K, read by the host that loads and shows it.
let isOpen = false;
// Where the focus goes back when the palette closes: not every browser gives it back when
// a modal dialog closes.
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();

function publish(open: boolean): void {
  isOpen = open;
  for (const listener of listeners) {
    listener();
  }
}

// Opened from a button, the focus goes back to that button: Safari does not focus a
// button it clicks. Otherwise, to whatever had the focus (the shortcut).
export function openCommandPalette(from?: HTMLElement): void {
  if (isOpen) {
    return;
  }
  opener = from ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  publish(true);
  playSound('open');
}

export function closeCommandPalette(): void {
  if (!isOpen) {
    return;
  }
  publish(false);
  opener?.focus();
  opener = null;
}

export function toggleCommandPalette(): void {
  if (isOpen) {
    closeCommandPalette();
  } else {
    openCommandPalette();
  }
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function useCommandPalette(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isOpen,
    () => false,
  );
}
