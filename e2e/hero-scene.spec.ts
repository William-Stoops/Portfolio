import { expect, type Page, test } from '@playwright/test';

import { isMobileLayout } from './support/interactions.ts';

// The scene's own chunk, and the WebGL helpers it shares with the Korea globe.
const SCENE_CHUNK = /(?:hero-scene-runtime|webgl)-[\w-]+\.js$/;

function recordSceneRequests(page: Page): string[] {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (SCENE_CHUNK.test(request.url())) {
      requests.push(request.url());
    }
  });
  return requests;
}

test.describe('hero scene', () => {
  test('draws the volatility surface behind the hero on large screens', async ({ page }) => {
    test.skip(isMobileLayout(page), 'the scene only runs on large screens');
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto('/fr');

    // The hero's scene only: the finale, at the bottom of the page, waits to be neared.
    await expect(page.locator('canvas[data-ready]')).toHaveCount(1, { timeout: 10_000 });
    // Every canvas is decoration, hidden from assistive tech itself or by its container.
    const hiddenCanvases = await page
      .locator('canvas')
      .evaluateAll((canvases) =>
        canvases.map((canvas) => canvas.closest('[aria-hidden="true"]') !== null),
      );
    expect(hiddenCanvases).not.toContain(false);
    expect(errors).toEqual([]);
  });

  test('closes the page with the settled surface once the contact section is neared', async ({
    page,
  }) => {
    test.skip(isMobileLayout(page), 'the scene only runs on large screens');
    await page.goto('/fr');
    await expect(page.locator('canvas[data-ready]')).toHaveCount(1, { timeout: 10_000 });

    // As a visitor does: through the navigation, which renders the deferred sections first.
    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Contact', exact: true })
      .click();

    await expect(page.locator('canvas[data-ready]')).toHaveCount(2, { timeout: 10_000 });
  });

  test('flies in over the surface as it rises, then lands behind the name', async ({ page }) => {
    test.skip(isMobileLayout(page), 'the scene only runs on large screens');
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await page.goto('/fr');
    const canvas = page.locator('canvas[data-ready]');
    await expect(canvas).toHaveCount(1, { timeout: 10_000 });

    // The flight lasts under three seconds: under way, then landed.
    await expect(canvas).not.toHaveAttribute('data-landed');
    await expect(canvas).toHaveAttribute('data-landed', '', { timeout: 10_000 });
  });

  test('dives into the page as the hero scrolls away', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/fr');
    const content = page.locator('main section').first().locator('.hero-dive');
    const scale = () => content.evaluate((element) => getComputedStyle(element).scale);

    expect(['none', '1']).toContain(await scale());
    // The content's bottom halfway up the screen: well into its way out, on any screen.
    await content.evaluate((element) => {
      const { bottom } = element.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + bottom - window.innerHeight / 2,
        behavior: 'instant',
      });
    });

    await expect.poll(async () => Number.parseFloat(await scale())).toBeGreaterThan(1);
  });

  test('keeps the hero still when the visitor asks for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/fr');
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'instant' });
    });

    const scale = await page
      .locator('main section')
      .first()
      .locator('.hero-dive')
      .evaluate((element) => getComputedStyle(element).scale);
    expect(['none', '1']).toContain(scale);
  });

  test('never loads the scene on a phone', async ({ page }) => {
    test.skip(!isMobileLayout(page), 'phones only');
    const sceneRequests = recordSceneRequests(page);

    await page.goto('/fr');
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas[data-ready]')).toHaveCount(0);
    expect(sceneRequests).toEqual([]);
  });

  test('never loads the scene when the visitor asks for reduced motion', async ({ page }) => {
    const sceneRequests = recordSceneRequests(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/fr');
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas[data-ready]')).toHaveCount(0);
    expect(sceneRequests).toEqual([]);
  });
});
