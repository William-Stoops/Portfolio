import { expect, type Page, test } from '@playwright/test';

import { isMobileLayout } from './support/interactions.ts';

const SCENE_CHUNK = /hero-scene-runtime-[\w-]+\.js$/;

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

    await page.goto('/');

    // The hero's scene only: the finale, at the bottom of the page, waits to be neared.
    await expect(page.locator('canvas[data-ready]')).toHaveCount(1, { timeout: 10_000 });
    for (const canvas of await page.locator('canvas').all()) {
      await expect(canvas).toHaveAttribute('aria-hidden', 'true');
    }
    expect(errors).toEqual([]);
  });

  test('closes the page with the settled surface once the contact section is neared', async ({
    page,
  }) => {
    test.skip(isMobileLayout(page), 'the scene only runs on large screens');
    await page.goto('/');
    await expect(page.locator('canvas[data-ready]')).toHaveCount(1, { timeout: 10_000 });

    // As a visitor does: through the navigation, which renders the deferred sections first.
    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Contact', exact: true })
      .click();

    await expect(page.locator('canvas[data-ready]')).toHaveCount(2, { timeout: 10_000 });
  });

  test('never loads the scene on a phone', async ({ page }) => {
    test.skip(!isMobileLayout(page), 'phones only');
    const sceneRequests = recordSceneRequests(page);

    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas[data-ready]')).toHaveCount(0);
    expect(sceneRequests).toEqual([]);
  });

  test('never loads the scene when the visitor asks for reduced motion', async ({ page }) => {
    const sceneRequests = recordSceneRequests(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(page.locator('canvas[data-ready]')).toHaveCount(0);
    expect(sceneRequests).toEqual([]);
  });
});
