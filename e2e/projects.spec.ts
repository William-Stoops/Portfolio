import { expect, test } from '@playwright/test';

test.describe('STAXX photos', () => {
  test('loads the Summit and NRJ Lille photos once the case study is reached', async ({ page }) => {
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/#projets');
    const staxx = page.getByRole('article', { name: 'STAXX' });

    for (const photo of await staxx.getByRole('figure').getByRole('img').all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          photo.evaluate((image) => image instanceof HTMLImageElement && image.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await expect(staxx.getByRole('figure').getByRole('img')).toHaveCount(3);
  });
});
