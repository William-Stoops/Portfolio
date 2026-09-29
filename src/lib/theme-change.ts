// Calls back whenever the colours of the page may have changed: a theme chosen with the
// toggle (`data-theme` on <html>) or the system switching between light and dark. What
// reads colours from the tokens (the WebGL scenes) reads them again then. Returns the
// function that stops listening.
export function onThemeChange(callback: () => void): () => void {
  const themeObserver = new MutationObserver(callback);
  themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  colorScheme.addEventListener('change', callback);
  return () => {
    themeObserver.disconnect();
    colorScheme.removeEventListener('change', callback);
  };
}
