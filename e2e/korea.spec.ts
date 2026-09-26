import { expect, test } from '@playwright/test';

test.describe('Korea section', () => {
  test('loads its three photos once reached', async ({ page }) => {
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/#coree');
    const section = page.getByRole('region', { name: 'Corée du Sud' });

    const photos = await section.getByRole('figure').getByRole('img').all();
    expect(photos).toHaveLength(3);
    for (const photo of photos) {
      await photo.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          photo.evaluate((image) => image instanceof HTMLImageElement && image.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
  });

  test('flies the plane from France towards Seoul as the page scrolls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#coree');
    const plane = page.locator('[data-flight-route] .voyage-altitude');
    const planeLeft = async (): Promise<number> =>
      plane.evaluate((element) => element.getBoundingClientRect().left);
    const atTakeOff = await planeLeft();

    // Pinned on a large screen, following the route on a small one: either way, scrolling on
    // carries the plane east.
    await page.evaluate(() => {
      window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'instant' });
    });

    await expect.poll(planeLeft).toBeGreaterThan(atTakeOff);
  });
});
