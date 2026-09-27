import { expect, test } from '@playwright/test';

test.describe('document', () => {
  test('declares French as page language', async ({ page }) => {
    await page.goto('/fr');

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('has a descriptive title', async ({ page }) => {
    await page.goto('/fr');

    await expect(page).toHaveTitle('William Stoops – Software Engineer & AI Engineer');
  });

  test('describes the page for search engines', async ({ page }) => {
    await page.goto('/fr');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Software Engineer/,
    );
  });

  test('never blocks pinch zoom', async ({ page }) => {
    await page.goto('/fr');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    await expect(viewport).not.toHaveAttribute('content', /maximum-scale|user-scalable/);
  });

  test('renders the main heading', async ({ page }) => {
    await page.goto('/fr');

    await expect(page.getByRole('heading', { level: 1, name: 'William Stoops' })).toBeVisible();
  });
});

test.describe('crawler files', () => {
  test('serves every picture file the page declares, with the right type', async ({
    page,
    request,
  }) => {
    await page.goto('/fr');
    // Every picture, the portrait and the STAXX photos further down alike.
    const declaredFiles = await page.evaluate(() =>
      [...document.querySelectorAll('picture source, picture img')].flatMap((element) =>
        (element.getAttribute('srcset') ?? '')
          .split(',')
          .map((candidate) => candidate.trim().split(' ')[0] ?? '')
          .filter((url) => url !== ''),
      ),
    );

    expect(declaredFiles.length).toBeGreaterThan(0);
    for (const url of new Set(declaredFiles)) {
      const response = await request.get(url);
      const extension = url.split('.').at(-1);
      const expectedType = extension === 'jpg' ? 'image/jpeg' : `image/${extension ?? ''}`;

      expect.soft(response.status(), url).toBe(200);
      expect.soft(response.headers()['content-type'], url).toBe(expectedType);
    }
  });

  test('serves a plain-text robots.txt allowing the whole site', async ({ request }) => {
    const response = await request.get('/robots.txt');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    expect(await response.text()).toMatch(/^User-agent: \*\nAllow: \/$/m);
  });
});

const ORIGIN = 'https://william-stoops.pages.dev';

test.describe('addresses and link previews', () => {
  test('gives each page its address and the same page in the other language', async ({ page }) => {
    await page.goto('/en/legal-notice');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/en/legal-notice`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/fr/mentions-legales`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/`,
    );
  });

  test('shows a card when the link is shared, an image the site serves', async ({
    page,
    request,
  }) => {
    await page.goto('/fr');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      await page.title(),
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'fr_FR');
    const image = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(image?.startsWith(`${ORIGIN}/images/`)).toBe(true);
    const response = await request.get(new URL(image ?? '').pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/jpeg');
  });

  test('lists every page of both languages in a sitemap robots.txt points to', async ({
    request,
  }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const path of ['/fr', '/en', '/fr/mentions-legales', '/en/site-map']) {
      expect(xml).toContain(`<loc>${ORIGIN}${path}</loc>`);
    }
  });
});
