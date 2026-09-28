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
