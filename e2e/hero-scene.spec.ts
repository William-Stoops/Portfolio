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

    await expect(page.locator('canvas[data-ready]')).toBeAttached({ timeout: 10_000 });
    await expect(page.locator('canvas')).toHaveAttribute('aria-hidden', 'true');
    expect(errors).toEqual([]);
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
