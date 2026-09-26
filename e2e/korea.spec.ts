import { expect, type Page, test } from '@playwright/test';

// The plane's horizontal position, as a share of its route's width, sampled while its
// flight scene crosses the viewport: pinned on a large screen, following its route on a
// small one, it must cross from one side to the other in the expected direction.
async function samplePlaneTrack(page: Page, stopId: string): Promise<number[]> {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`/#${stopId}`);
  const scene = page.locator(`#${stopId} .voyage-track`);
  const plane = scene.locator('[data-flight-route] .voyage-altitude');
  const { top, height } = await scene.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { top: box.top + window.scrollY, height: box.height };
  });
  const viewport = await page.evaluate(() => window.innerHeight);
  const positions: number[] = [];
  for (let step = 0; step <= 40; step += 1) {
    await page.evaluate(
      (y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      },
      top - viewport + ((height + viewport) * step) / 40,
    );
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(resolve);
        }),
    );
    positions.push(
      await plane.evaluate((element) => {
        const route = element.closest('[data-flight-route]')?.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return route === undefined ? 0 : (box.left + box.width / 2 - route.left) / route.width;
      }),
    );
  }
  return positions;
}

test.describe('Korea section', () => {
  test('loads its three photos once reached', async ({ page }) => {
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/#coree');
    const section = page.locator('#coree');

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

  test('flies the plane east, from France to Seoul, as the page scrolls', async ({ page }) => {
    const positions = await samplePlaneTrack(page, 'coree');

    expect(Math.max(...positions) - Math.min(...positions), positions.join(', ')).toBeGreaterThan(
      0.5,
    );
    expect(positions.at(-1) ?? 0).toBeGreaterThan(positions[0] ?? 0);
  });

  test('flies the plane home, west towards France, as the page scrolls', async ({ page }) => {
    const positions = await samplePlaneTrack(page, 'annee-2025');

    expect(Math.max(...positions) - Math.min(...positions), positions.join(', ')).toBeGreaterThan(
      0.5,
    );
    expect(positions.at(-1) ?? 0, positions.join(', ')).toBeLessThan(positions[0] ?? 0);
  });
});
