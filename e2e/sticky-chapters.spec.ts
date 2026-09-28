import { expect, test } from '@playwright/test';

import { isMobileLayout } from './support/interactions.ts';

test.describe('sticky chapters', () => {
  test('shows one chapter title at a time while the skills are read', async ({ page }) => {
    test.skip(isMobileLayout(page), 'The sticky column exists on large screens only.');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/#competences');
    const chapters = page.locator('[data-chapter-label]');
    await expect(chapters.first()).toBeAttached();
    const top = await page.evaluate(
      () => document.getElementById('competences')?.getBoundingClientRect().top ?? 0,
    );
    const start = await page.evaluate((offset) => window.scrollY + offset, top);

    for (let step = 0; step < 40; step += 1) {
      await page.evaluate(
        (y) => {
          window.scrollTo({ top: y, behavior: 'instant' });
        },
        start + step * 60,
      );
      const visible = await chapters.evaluateAll(
        (labels) => labels.filter((label) => Number(getComputedStyle(label).opacity) > 0.4).length,
      );
      expect.soft(visible, `after ${String(step * 60)} px`).toBeLessThanOrEqual(1);
    }
  });
});
