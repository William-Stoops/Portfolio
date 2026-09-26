import { expect, type Page, test } from '@playwright/test';

import { openMenuIfCollapsed } from './support/interactions.ts';

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
  test('carries the home page content in the HTML response itself', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    const html = await response.text();
    // The name is read as one text; the letters that rise one by one are aria-hidden.
    expect(html).toMatch(
      /<h1[^>]*><span class="sr-only">William Stoops<\/span><span aria-hidden="true">/,
    );
    expect(html).toContain('<title>William Stoops – Software Engineer &amp; AI Engineer</title>');
  });

  test('carries the sections whose code loads later, such as Korea, in the HTML too', async ({
    request,
  }) => {
    const html = await (await request.get('/')).text();

    expect(html).toContain('<li id="coree"');
    expect(html).toContain('안녕하세요');
    expect(html).toContain('Ce que j’y ai entraîné');
  });

  for (const { path, heading } of [
    { path: '/accessibilite', heading: 'Déclaration d’accessibilité' },
    { path: '/mentions-legales', heading: 'Mentions légales' },
    { path: '/plan-du-site', heading: 'Plan du site' },
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
    const response = await request.get('/page-inexistante');

    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).toMatch(/<h1[^>]*>Page introuvable<\/h1>/);
    expect(html).toContain('<title>Page introuvable – William Stoops</title>');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('still shows the page content and title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'William Stoops' })).toBeVisible();
    await expect(page).toHaveTitle('William Stoops – Software Engineer & AI Engineer');
  });
});

test.describe('hydration', () => {
  for (const { path, isNotFound } of [
    { path: '/', isNotFound: false },
    { path: '/page-inexistante', isNotFound: true },
    { path: '/mentions-legales', isNotFound: false },
  ]) {
    test(`hydrates ${path} without errors and becomes interactive`, async ({ page }) => {
      const errors = collectErrors(page, isNotFound ? path : undefined);

      await page.goto(path);
      await openMenuIfCollapsed(page);
      await page.getByRole('button', { name: 'Thème sombre' }).click();

      await expect(page.getByRole('button', { name: 'Thème sombre' })).toHaveAttribute(
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

    await page.goto('/');
    await openMenuIfCollapsed(page);

    await expect(page.getByRole('button', { name: 'Thème sombre' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(errors).toEqual([]);
  });

  test('keeps a single document title after hydration', async ({ page }) => {
    await page.goto('/');
    await openMenuIfCollapsed(page);
    await page.getByRole('button', { name: 'Thème clair' }).click();

    await expect(page.locator('title')).toHaveCount(1);
    await expect(page).toHaveTitle('William Stoops – Software Engineer & AI Engineer');
  });
});
