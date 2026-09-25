const ROOT_MARKER = '<div id="root"></div>';
const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/;

// React renders a page's <title> where the component sits; in a document it belongs in the
// <head>. On the client, React 19 hoists the same <title> there, so the markup matches.
export function injectRenderedPage(template: string, renderedHtml: string): string {
  if (!template.includes(ROOT_MARKER)) {
    throw new Error(`The HTML template must contain an empty ${ROOT_MARKER}`);
  }

  const renderedTitle = TITLE_PATTERN.exec(renderedHtml)?.[0];
  const bodyHtml =
    renderedTitle === undefined ? renderedHtml : renderedHtml.replace(renderedTitle, '');
  const templateWithTitle =
    renderedTitle === undefined ? template : template.replace(TITLE_PATTERN, renderedTitle);

  return templateWithTitle.replace(ROOT_MARKER, `<div id="root">${bodyHtml}</div>`);
}
