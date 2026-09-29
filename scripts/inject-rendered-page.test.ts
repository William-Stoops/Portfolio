import { describe, expect, it } from 'vitest';

import { injectRenderedPage, renderedMetadata } from './inject-rendered-page.ts';

const TEMPLATE = `<!doctype html>
<html lang="fr">
  <head>
    <title>Titre par défaut</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const FRENCH = { lang: 'fr', preloads: [] } as const;

// The built template: the entry script comes first in the head, with its own preloads.
const BUILT_TEMPLATE = TEMPLATE.replace(
  '  </head>',
  '    <script type="module" crossorigin src="/assets/index.js"></script>\n  </head>',
);

// A picture as React renders it: its modern formats first, then the image itself.
function renderedPicture(fetchPriority: 'high' | 'auto'): string {
  return `<picture><source type="image/avif" srcSet="/p-480.avif 480w, /p-800.avif 800w" sizes="(min-width: 64rem) 28rem, 100vw"/><source type="image/webp" srcSet="/p-480.webp 480w" sizes="100vw"/><img src="/p-800.jpg" alt="Portrait" fetchPriority="${fetchPriority}"/></picture>`;
}

describe('injectRenderedPage', () => {
  it('places the rendered markup inside the root element', () => {
    const page = injectRenderedPage(
      TEMPLATE,
      '<main id="main"><h1>William Stoops</h1></main>',
      FRENCH,
    );

    expect(page).toContain('<div id="root"><main id="main"><h1>William Stoops</h1></main></div>');
  });

  it('moves the rendered title into the head, replacing the default one', () => {
    const page = injectRenderedPage(
      TEMPLATE,
      '<title>Page introuvable – William Stoops</title><h1>Page introuvable</h1>',
      FRENCH,
    );

    expect(page).toContain('<title>Page introuvable – William Stoops</title>');
    expect(page).not.toContain('Titre par défaut');
    expect(page.match(/<title>/g)).toHaveLength(1);
    expect(page).toContain('<div id="root"><h1>Page introuvable</h1></div>');
  });

  it('keeps the default title when the page renders none', () => {
    const page = injectRenderedPage(TEMPLATE, '<h1>Sans titre</h1>', FRENCH);

    expect(page).toContain('<title>Titre par défaut</title>');
  });

  it('moves the rendered description into the head, after the title', () => {
    const page = injectRenderedPage(
      TEMPLATE,
      '<title>Legal notice – William Stoops</title><meta name="description" content="Publisher, hosting."/><h1>Legal notice</h1>',
      { lang: 'en', preloads: [] },
    );

    expect(page).toContain(
      '<title>Legal notice – William Stoops</title><meta name="description" content="Publisher, hosting."/>',
    );
    expect(page).toContain('<div id="root"><h1>Legal notice</h1></div>');
    expect(page.match(/name="description"/g)).toHaveLength(1);
  });

  it('declares the language of the page on the document', () => {
    const page = injectRenderedPage(TEMPLATE, '<h1>Home</h1>', { lang: 'en', preloads: [] });

    expect(page).toContain('<html lang="en">');
  });

  it('preloads the chunks the page needs before it hydrates', () => {
    const page = injectRenderedPage(TEMPLATE, '<h1>Home</h1>', {
      lang: 'en',
      preloads: ['/assets/site-content.en-abc.js'],
    });

    expect(page).toContain(
      '<link rel="modulepreload" crossorigin href="/assets/site-content.en-abc.js">\n  </head>',
    );
  });

  it('adds the page’s own head tags (addresses, link preview) before the head closes', () => {
    const page = injectRenderedPage(TEMPLATE, '<h1>Accueil</h1>', {
      ...FRENCH,
      extraHead: '<link rel="canonical" href="https://example.test/fr">',
    });

    expect(page).toContain('<link rel="canonical" href="https://example.test/fr">  </head>');
  });

  it('asks for the picture painted first before any script, in its most modern format', () => {
    const page = injectRenderedPage(
      BUILT_TEMPLATE,
      `<h1>Accueil</h1>${renderedPicture('high')}`,
      FRENCH,
    );

    const preload =
      '<link rel="preload" as="image" type="image/avif" imagesrcset="/p-480.avif 480w, /p-800.avif 800w" imagesizes="(min-width: 64rem) 28rem, 100vw" fetchpriority="high">';
    expect(page).toContain(preload);
    expect(page.indexOf(preload)).toBeLessThan(page.indexOf('<script type="module"'));
    expect(page.match(/rel="preload" as="image"/g)).toHaveLength(1);
  });

  it('asks for it before the head closes where the template has no script', () => {
    const page = injectRenderedPage(TEMPLATE, renderedPicture('high'), FRENCH);

    expect(page).toMatch(/<link rel="preload" as="image"[^>]*>\s*<\/head>/);
  });

  it('preloads no picture where none is marked as the one painted first', () => {
    const page = injectRenderedPage(BUILT_TEMPLATE, renderedPicture('auto'), FRENCH);

    expect(page).not.toContain('rel="preload" as="image"');
  });

  it('fails loudly when the template has no empty root element', () => {
    expect(() => injectRenderedPage('<html><body></body></html>', '<h1>x</h1>', FRENCH)).toThrow(
      /<div id="root"><\/div>/,
    );
  });
});

describe('renderedMetadata', () => {
  it('reads the title and the description a page rendered, as written', () => {
    expect(
      renderedMetadata(
        '<title>Accueil – William Stoops</title><meta name="description" content="Profil &amp; parcours"/><h1>x</h1>',
      ),
    ).toEqual({ title: 'Accueil – William Stoops', description: 'Profil &amp; parcours' });
  });

  it('gives nothing for a page without a title', () => {
    expect(renderedMetadata('<h1>x</h1>')).toBeUndefined();
  });
});
