import { expect, test } from '@playwright/test';

test.describe('hero', () => {
  test('states the real weight of the downloadable CV', async ({ page, request }) => {
    await page.goto('/fr');
    // The bar's link (the hero and the footer offer the same file).
    const link = page.getByRole('link', { name: /^Télécharger le CV/ }).first();
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();

    const response = await request.get(href ?? '');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    const kilobytes = Math.round((await response.body()).byteLength / 1024);
    await expect(link).toHaveAccessibleName(`Télécharger le CV (PDF, ${String(kilobytes)} Ko)`);
  });

  test('displays the photo fully loaded', async ({ page }) => {
    await page.goto('/fr');
    const portrait = page.getByRole('img', {
      name: 'Portrait de William Stoops, en veste sombre, dans la lumière du soleil',
    });

    await expect(portrait).toBeVisible();
    await expect
      .poll(() =>
        portrait.evaluate((image) => image instanceof HTMLImageElement && image.naturalWidth),
      )
      .toBeGreaterThan(0);
  });
});
