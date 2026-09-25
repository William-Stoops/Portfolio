import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/entry-server';

describe('renderRoute', () => {
  it('renders the home page markup with its landmarks, heading and title', async () => {
    const html = await renderRoute('/');

    expect(html).toContain('<main id="main"');
    expect(html).toMatch(/<h1[^>]*>William Stoops<\/h1>/);
    expect(html).toContain('<title>William Stoops – Software Engineer &amp; AI Engineer</title>');
  });

  it('renders the not-found page for the 404 document', async () => {
    const html = await renderRoute('/404');

    expect(html).toMatch(/<h1[^>]*>Page introuvable<\/h1>/);
    expect(html).toContain('<title>Page introuvable – William Stoops</title>');
  });

  it('adds no inline script, so a strict Content-Security-Policy stays possible', async () => {
    const html = await renderRoute('/');

    expect(html).not.toContain('<script');
  });
});
