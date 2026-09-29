const ROOT_MARKER = '<div id="root"></div>';
const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/;
const DESCRIPTION_PATTERN = /<meta name="description"[^>]*>/;
const LANG_PATTERN = /<html lang="[^"]*">/;
const PICTURE_PATTERN = /<picture>[\s\S]*?<\/picture>/g;
const FIRST_SOURCE_PATTERN = /<source type="([^"]*)" srcSet="([^"]*)" sizes="([^"]*)"/;
const FIRST_SCRIPT_PATTERN = /^( *)<script/m;

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

// The picture a page paints first, marked for it (fetchPriority="high"), asked for before
// any script, in its most modern format: a browser without that format skips the preload
// by its type. Otherwise found in the body only, it queued behind the head's chunks: over
// HTTP/1.1, six connections a host, one chunk more delayed the largest paint.
function firstPicturePreload(renderedHtml: string): string {
  const picture = Array.from(renderedHtml.matchAll(PICTURE_PATTERN), ([markup]) => markup).find(
    (markup) => markup.includes('fetchPriority="high"'),
  );
  const source = FIRST_SOURCE_PATTERN.exec(picture ?? '');
  if (source === null) {
    return '';
  }
  const [, type = '', srcSet = '', sizes = ''] = source;
  return `<link rel="preload" as="image" type="${type}" imagesrcset="${srcSet}" imagesizes="${sizes}" fetchpriority="high">`;
}

function beforeFirstScript(document: string, tag: string): string {
  if (tag === '') {
    return document;
  }
  return FIRST_SCRIPT_PATTERN.test(document)
    ? document.replace(
        FIRST_SCRIPT_PATTERN,
        (_script, indent: string) => `${indent}${tag}\n${indent}<script`,
      )
    : document.replace('  </head>', `    ${tag}\n  </head>`);
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

  return beforeFirstScript(head, firstPicturePreload(bodyHtml))
    .replace(LANG_PATTERN, `<html lang="${lang}">`)
    .replace('  </head>', `${preloadLinks}${extraHead}  </head>`)
    .replace(ROOT_MARKER, `<div id="root">${bodyHtml}</div>`);
}
