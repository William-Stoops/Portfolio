import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/entry-server';

describe('renderRoute', () => {
  it('renders the French home page markup with its landmarks, heading, title and description', async () => {
    const html = await renderRoute('/fr');

    expect(html).toContain('<main id="main"');
    expect(html).toMatch(
      /<h1[^>]*><span class="sr-only">William Stoops : <\/span>Je décide d’une architecture/,
    );
    expect(html).toContain('<title>William Stoops – Software Engineer &amp; AI Engineer</title>');
    expect(html).toMatch(/<meta name="description" content="William Stoops, [^"]*au quotidien\."/);
    expect(html).toContain('Basé à Paris · ouvert à Lille ou en full remote');
  });

  it('renders the English home page in English, from the English content', async () => {
    const html = await renderRoute('/en');

    expect(html).toContain('Based in Paris · open to Lille or fully remote');
    expect(html).toMatch(/<meta name="description" content="[^"]*every day\."/);
    expect(html).toContain('href="/fr"');
    expect(html).not.toContain('Basé à Paris');
  });

  it('renders the not-found page of each locale, French outside both', async () => {
    expect(await renderRoute('/404')).toMatch(/<h1[^>]*>Page introuvable<\/h1>/);
    expect(await renderRoute('/fr/404')).toContain(
      '<title>Page introuvable – William Stoops</title>',
    );
    expect(await renderRoute('/en/404')).toMatch(/<h1[^>]*>Page not found<\/h1>/);
  });

  it('adds no inline script, so a strict Content-Security-Policy stays possible', async () => {
    const html = await renderRoute('/fr');

    expect(html).not.toContain('<script');
  });
});
