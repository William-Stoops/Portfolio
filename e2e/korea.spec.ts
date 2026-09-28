import { expect, type Page, test } from '@playwright/test';

import { isMobileLayout } from './support/interactions.ts';

const GLOBE_CHUNK = /flight-globe-runtime-[\w-]+\.js$/;
// The WebGL helpers the globe shares with the hero's scene.
const WEBGL_CHUNK = /webgl-[\w-]+\.js$/;

// Where the scene is pinned (large, tall screens: the desktop projects), the plane flies
// over the globe; elsewhere along the flat arc.
function flightMapOf(page: Page): 'globe' | 'arc' {
  return isMobileLayout(page) ? 'arc' : 'globe';
}

// How much of its map's width the plane must cross: the arc spans its route, the globe's
// route spans about half of the globe.
const MIN_CROSSING = { arc: 0.5, globe: 0.3 } as const;

function recordRequests(page: Page, chunk: RegExp): string[] {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (chunk.test(request.url())) {
      requests.push(request.url());
    }
  });
  return requests;
}

// The plane's horizontal position, as a share of its map's width, sampled while its flight
// scene crosses the viewport: pinned on a large screen, following its route on a small
// one, it must cross from one side to the other in the expected direction.
async function samplePlaneTrack(page: Page, stopId: string): Promise<number[]> {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`/fr#${stopId}`);
  // The stop's flight scene: 2025 also pins the Epitech Summit.
  const scene = page
    .locator(`#${stopId} .scene-track`)
    .filter({ has: page.locator('[data-flight-route]') });
  const flightMap = flightMapOf(page);
  if (flightMap === 'globe') {
    await expect(scene.locator('[data-globe]')).toBeAttached({ timeout: 10_000 });
  }
  const map = scene.locator(flightMap === 'globe' ? '[data-flight-globe]' : '[data-flight-route]');
  const plane = map.locator('[data-flight-plane]');
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
    // Two frames: the globe draws on the frame after the scroll.
    for (let frame = 0; frame < 2; frame += 1) {
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            requestAnimationFrame(resolve);
          }),
      );
    }
    positions.push(
      await plane.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const mapBox = element.closest('[data-flight-route], [data-flight-globe]');
        const route = mapBox?.getBoundingClientRect();
        return route === undefined ? 0 : (box.left + box.width / 2 - route.left) / route.width;
      }),
    );
  }
  return positions;
}

test.describe('Korea section', () => {
  test('loads its three photos once reached', async ({ page }) => {
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/fr#coree');
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
      MIN_CROSSING[flightMapOf(page)],
    );
    expect(positions.at(-1) ?? 0).toBeGreaterThan(positions[0] ?? 0);
  });

  test('flies the plane home, west towards France, as the page scrolls', async ({ page }) => {
    const positions = await samplePlaneTrack(page, 'annee-2025');

    expect(Math.max(...positions) - Math.min(...positions), positions.join(', ')).toBeGreaterThan(
      MIN_CROSSING[flightMapOf(page)],
    );
    expect(positions.at(-1) ?? 0, positions.join(', ')).toBeLessThan(positions[0] ?? 0);
  });
});

test.describe('Korea globe', () => {
  test('flies over a globe on large screens, loaded only as the voyage nears', async ({ page }) => {
    test.skip(isMobileLayout(page), 'the globe only runs where the scene is pinned');
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const globeRequests = recordRequests(page, GLOBE_CHUNK);
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await page.goto('/fr');
    await page.waitForTimeout(1500);
    expect(globeRequests).toEqual([]);

    // As a visitor does: to the journey through the navigation, then down to Seoul.
    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Parcours', exact: true })
      .click();
    const voyage = page.locator('#coree .scene-track');
    await voyage.scrollIntoViewIfNeeded();
    await expect(voyage.locator('[data-globe]')).toBeAttached({ timeout: 10_000 });
    await expect(voyage.locator('[data-flight-globe] canvas')).toBeVisible();
    await expect(voyage.locator('[data-flight-route]')).toBeHidden();
    expect(globeRequests).toHaveLength(1);
    expect(errors).toEqual([]);
  });

  test('keeps the flat arc on a phone or a tablet', async ({ page }) => {
    test.skip(!isMobileLayout(page), 'small screens only');
    const globeRequests = recordRequests(page, GLOBE_CHUNK);
    const webglRequests = recordRequests(page, WEBGL_CHUNK);
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await page.goto('/fr#coree');
    await page.waitForTimeout(2000);

    await expect(page.locator('#coree [data-flight-route]')).toBeVisible();
    await expect(page.locator('#coree [data-globe]')).toHaveCount(0);
    expect([...globeRequests, ...webglRequests]).toEqual([]);
  });

  test('keeps the flat arc, at rest, when the visitor asks for reduced motion', async ({
    page,
  }) => {
    const globeRequests = recordRequests(page, GLOBE_CHUNK);
    const webglRequests = recordRequests(page, WEBGL_CHUNK);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/fr#coree');
    await page.waitForTimeout(2000);

    await expect(page.locator('#coree [data-flight-route]')).toBeVisible();
    await expect(page.locator('#coree [data-globe]')).toHaveCount(0);
    expect([...globeRequests, ...webglRequests]).toEqual([]);
  });
});
