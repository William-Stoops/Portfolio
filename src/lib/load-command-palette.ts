// The quick search's own chunk (ADR 0034): fetched on its first opening, or as soon as the
// visitor aims at its button. A second call gets the module already loaded.
export function loadCommandPalette() {
  return import('@/components/layout/command-palette');
}
