import { describe, expect, it } from 'vitest';

import { injectRenderedPage } from './inject-rendered-page.ts';

const TEMPLATE = `<!doctype html>
<html lang="fr">
  <head>
    <title>Titre par défaut</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

describe('injectRenderedPage', () => {
  it('places the rendered markup inside the root element', () => {
    const page = injectRenderedPage(TEMPLATE, '<main id="main"><h1>William Stoops</h1></main>');

    expect(page).toContain('<div id="root"><main id="main"><h1>William Stoops</h1></main></div>');
  });

  it('moves the rendered title into the head, replacing the default one', () => {
    const page = injectRenderedPage(
      TEMPLATE,
      '<title>Page introuvable – William Stoops</title><h1>Page introuvable</h1>',
    );

    expect(page).toContain('<title>Page introuvable – William Stoops</title>');
    expect(page).not.toContain('Titre par défaut');
    expect(page.match(/<title>/g)).toHaveLength(1);
    expect(page).toContain('<div id="root"><h1>Page introuvable</h1></div>');
  });

  it('keeps the default title when the page renders none', () => {
    const page = injectRenderedPage(TEMPLATE, '<h1>Sans titre</h1>');

    expect(page).toContain('<title>Titre par défaut</title>');
  });

  it('fails loudly when the template has no empty root element', () => {
    expect(() => injectRenderedPage('<html><body></body></html>', '<h1>x</h1>')).toThrow(
      /<div id="root"><\/div>/,
    );
  });
});
