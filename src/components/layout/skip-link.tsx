// First focusable element of every page (WCAG 2.4.1, RGAA 12.7). The target <main> has
// tabIndex={-1}, so native fragment navigation moves keyboard focus to it.
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-skip-link) focus:rounded-md focus:bg-accent focus:px-4 focus:py-3 focus:font-semibold focus:text-on-accent focus:no-underline"
    >
      Aller au contenu principal
    </a>
  );
}
