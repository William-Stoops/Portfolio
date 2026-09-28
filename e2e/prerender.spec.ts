import { expect, type Page, test } from '@playwright/test';

import { openSiteMenu } from './support/interactions.ts';

// Collects console errors and uncaught exceptions. When a not-found document is expected,
// the browser logs its 404 status: that one message is the intended behaviour. (Compared by
// path: WebKit logs it before navigation commits, while page.url() is still the old URL.)
function collectErrors(page: Page, expectedNotFoundPath?: string): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    const isDocumentNotFoundStatus =
      expectedNotFoundPath !== undefined &&
      new URL(message.location().url).pathname === expectedNotFoundPath &&
      message.text().includes('status of 404');
    if (message.type() === 'error' && !isDocumentNotFoundStatus) {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}

test.describe('prerendered HTML', () => {
  test('serves the pages compressed, as the host does', async ({ request }) => {
    for (const path of ['/fr', '/en', '/fr/page-inexistante']) {
      const response = await request.get(path, { headers: { 'Accept-Encoding': 'br, gzip' } });

      expect(response.headers()['content-encoding'], path).toBe('br');
      expect(response.headers()['vary'], path).toBe('Accept-Encoding');
    }
  });

  test('carries the home page content in the HTML response itself', async ({ request }) => {
    const response = await request.get('/fr');

    expect(response.status()).toBe(200);
    const html = await response.text();
    // The sentence of the CV heads the page, and says whose it is.
    expect(html).toMatch(
      /<h1[^>]*><span class="sr-only">William Stoops : <\/span>Je décide d’une architecture/,
    );
    expect(html).toContain('<title>William Stoops – Software Engineer &amp; AI Engineer</title>');
  });

  test('carries the sections whose code loads later, such as Korea, in the HTML too', async ({
    request,
  }) => {
    const html = await (await request.get('/fr')).text();

    expect(html).toContain('<li id="coree"');
    expect(html).toContain('안녕하세요');
    expect(html).toContain('Modèles entraînés');
  });

  for (const { path, heading } of [
    { path: '/fr/coulisses', heading: 'Les coulisses du site' },
    { path: '/fr/accessibilite', heading: 'Déclaration d’accessibilité' },
    { path: '/fr/mentions-legales', heading: 'Mentions légales' },
    { path: '/fr/plan-du-site', heading: 'Plan du site' },
  ]) {
    test(`serves ${path} as its own prerendered document`, async ({ request }) => {
      const response = await request.get(path);

      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toMatch(new RegExp(`<h1[^>]*>${heading}</h1>`));
      expect(html).toContain(`<title>${heading} – William Stoops</title>`);
    });
  }

  test('answers unknown URLs with the not-found page and a real 404 status', async ({
    request,
  }) => {
    const response = await request.get('/fr/page-inexistante');

    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).toMatch(/<h1[^>]*>Page introuvable<\/h1>/);
    expect(html).toContain('<title>Page introuvable – William Stoops</title>');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('still shows the page content and title', async ({ page }) => {
    await page.goto('/fr');

    await expect(page.getByRole('heading', { level: 1, name: 'William Stoops' })).toBeVisible();
    await expect(page).toHaveTitle('William Stoops – Software Engineer & AI Engineer');
  });
});

test.describe('hydration', () => {
  for (const { path, isNotFound, darkTheme } of [
    { path: '/fr', isNotFound: false, darkTheme: 'Thème sombre' },
    { path: '/en', isNotFound: false, darkTheme: 'Dark theme' },
    { path: '/fr/page-inexistante', isNotFound: true, darkTheme: 'Thème sombre' },
    { path: '/fr/mentions-legales', isNotFound: false, darkTheme: 'Thème sombre' },
    { path: '/en/legal-notice', isNotFound: false, darkTheme: 'Dark theme' },
  ]) {
    test(`hydrates ${path} without errors and becomes interactive`, async ({ page }) => {
      const errors = collectErrors(page, isNotFound ? path : undefined);

      await page.goto(path);
      await openSiteMenu(page);
      await page.getByRole('button', { name: darkTheme }).click();

      await expect(page.getByRole('button', { name: darkTheme })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(errors).toEqual([]);
    });
  }

  test('reconciles a stored theme with the prerendered default without errors', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.addInitScript(() => {
      localStorage.setItem('theme-preference', 'dark');
    });

    await page.goto('/fr');
    await openSiteMenu(page);

    await expect(page.getByRole('button', { name: 'Thème sombre' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(errors).toEqual([]);
  });

  test('keeps a single document title after hydration', async ({ page }) => {
    await page.goto('/fr');
    await openSiteMenu(page);
    await page.getByRole('button', { name: 'Thème clair' }).click();

    await expect(page.locator('title')).toHaveCount(1);
    await expect(page).toHaveTitle('William Stoops – Software Engineer & AI Engineer');
  });
});
