import { expect, test } from '@playwright/test';

test.describe('hero', () => {
  test('states the real weight of the downloadable CV', async ({ page, request }) => {
    await page.goto('/');
    // The hero's link (the footer offers the same file).
    const link = page.getByRole('link', { name: /^Télécharger le CV/ }).first();
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();

    const response = await request.get(href ?? '');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    const kilobytes = Math.round((await response.body()).byteLength / 1024);
    await expect(link).toHaveAccessibleName(`Télécharger le CV (PDF, ${String(kilobytes)} Ko)`);
  });

  test('serves every portrait file the page declares, with the right type', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const declaredFiles = await page.locator('picture').evaluate((picture) =>
      [...picture.querySelectorAll('source, img')].flatMap((element) =>
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

  test('displays the portrait fully loaded', async ({ page }) => {
    await page.goto('/');
    const portrait = page.getByRole('img', { name: 'William Stoops, souriant, sur scène' });

    await expect(portrait).toBeVisible();
    await expect
      .poll(() =>
        portrait.evaluate((image) => image instanceof HTMLImageElement && image.naturalWidth),
      )
      .toBeGreaterThan(0);
  });
});
