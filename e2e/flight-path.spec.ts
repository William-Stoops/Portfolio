import { expect, test } from '@playwright/test';

import { waitForHydration } from './support/hydration.ts';
import { isMobileLayout } from './support/interactions.ts';

test.describe('flight path', () => {
  test('names one waypoint at a time beside the rail, all the way down', async ({ page }) => {
    test.skip(isMobileLayout(page), 'The column of waypoints exists on large screens only.');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/fr#parcours');
    const waypoints = page.locator('[data-waypoint]');
    await expect(waypoints.first()).toBeAttached();
    const height = await page.evaluate(() => document.documentElement.scrollHeight);

    for (let top = 0; top < height; top += 450) {
      await page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      }, top);
      const shown = await waypoints.evaluateAll(
        (labels) =>
          labels.filter((label) => {
            const inner = label.firstElementChild;
            const opacity =
              Number(getComputedStyle(label).opacity) *
              Number(inner === null ? 1 : getComputedStyle(inner).opacity);
            return opacity > 0.4;
          }).length,
      );
      expect.soft(shown, `at ${String(top)} px`).toBeLessThanOrEqual(1);
    }
  });

  test('turns the plane around when the reader scrolls back up', async ({ page }) => {
    test.skip(isMobileLayout(page), 'The plane rides the rail on large screens only.');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/fr#parcours');
    // The journey's code loads as hydration reaches it: its heading is followed from then.
    await waitForHydration(page, '[data-flight-rail]');
    const plane = page.locator('[data-flight-rail] .plane-heading');
    const turn = () => plane.evaluate((element) => getComputedStyle(element).rotate);

    await page.mouse.wheel(0, 1600);
    await expect.poll(turn).toBe('none');

    await page.mouse.wheel(0, -600);
    await expect.poll(turn).toBe('180deg');

    await page.mouse.wheel(0, 600);
    await expect.poll(turn).toBe('none');
  });

  test('gives every element of the home page an id of its own', async ({ page }) => {
    await page.goto('/fr#parcours');

    const duplicates = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });

    expect(duplicates).toEqual([]);
  });
});
