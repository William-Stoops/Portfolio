const ROOT_MARKER = '<div id="root"></div>';
const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/;
const DESCRIPTION_PATTERN = /<meta name="description"[^>]*>/;
const LANG_PATTERN = /<html lang="[^"]*">/;

type PageHead = {
  // The page's locale: `<html lang>` (ADR 0026).
  lang: string;
  // Chunks to fetch in parallel with the entry: the locale's content, which hydration awaits.
  preloads: readonly string[];
  // The page's own tags for crawlers and link previews (scripts/page-head.ts).
  extraHead?: string;
};

// The title and the description a page rendered, as React wrote them (escaped for HTML):
// what its link preview repeats.
export function renderedMetadata(
  renderedHtml: string,
): { title: string; description: string } | undefined {
  const title = /<title>([\s\S]*?)<\/title>/.exec(renderedHtml)?.[1];
  if (title === undefined) {
    return undefined;
  }
  const description = /<meta name="description" content="([^"]*)"/.exec(renderedHtml)?.[1] ?? '';
  return { title, description };
}

// React renders a page's <title> and <meta name="description"> where the component sits; in
// a document they belong in the <head>. On the client, React 19 hoists the same elements
// there, so the markup matches.
export function injectRenderedPage(
  template: string,
  renderedHtml: string,
  { lang, preloads, extraHead = '' }: PageHead,
): string {
  if (!template.includes(ROOT_MARKER)) {
    throw new Error(`The HTML template must contain an empty ${ROOT_MARKER}`);
  }

  const renderedTitle = TITLE_PATTERN.exec(renderedHtml)?.[0];
  const renderedDescription = DESCRIPTION_PATTERN.exec(renderedHtml)?.[0] ?? '';
  const bodyHtml = renderedHtml.replace(TITLE_PATTERN, '').replace(DESCRIPTION_PATTERN, '');
  const head =
    renderedTitle === undefined
      ? template
      : template.replace(TITLE_PATTERN, `${renderedTitle}${renderedDescription}`);
  const preloadLinks = preloads
    .map((href) => `    <link rel="modulepreload" crossorigin href="${href}">\n`)
    .join('');

  return head
    .replace(LANG_PATTERN, `<html lang="${lang}">`)
    .replace('  </head>', `${preloadLinks}${extraHead}  </head>`)
    .replace(ROOT_MARKER, `<div id="root">${bodyHtml}</div>`);
}
