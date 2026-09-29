import { expect, test } from '@playwright/test';

import { renderEverySection } from './support/hydration.ts';

const ROUTES = [
  '/fr',
  '/en',
  '/fr/page-inexistante',
  '/fr/coulisses',
  '/fr/mentions-legales',
  '/fr/plan-du-site',
] as const;
const SWEEP_WIDTHS = [320, 360, 375, 414, 600, 768, 900, 1024, 1280, 1440, 1920, 2560];

for (const route of ROUTES) {
  test(`never scrolls horizontally on ${route} from 320 to 2560 px`, async ({ page }) => {
    // The sweep sets its own viewport sizes: running it once is enough.
    test.skip(test.info().project.name !== 'desktop', 'viewport sweep runs on one project');
    await page.goto(route);
    // Every section laid out, as a visitor who scrolls down gets them: a deferred section
    // (ADR 0018) left as a placeholder would hide what overflows in it.
    await renderEverySection(page);

    for (const width of SWEEP_WIDTHS) {
      await page.setViewportSize({ width, height: 800 });

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );

      expect.soft(hasHorizontalOverflow, `overflow at ${String(width)} px`).toBe(false);
    }
  });
}

// What moves with the scroll (a flight, a flag assembling, a label pinned on a turning
// globe) can reach past the edge only halfway: the home page is read from top to bottom.
const SCROLL_WIDTHS = [320, 375, 768, 1024, 1440, 2560];

for (const route of ['/fr', '/en'] as const) {
  test(`never scrolls horizontally on ${route} at any point of its scroll`, async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport sweep runs on one project');
    test.setTimeout(120_000);
    await page.goto(route);
    await renderEverySection(page);

    for (const width of SCROLL_WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let top = 0; top < height; top += 400) {
        const overflow = await page.evaluate(async (y) => {
          window.scrollTo({ top: y, behavior: 'instant' });
          // Scroll-driven animations take their new place at the next frames.
          for (let frame = 0; frame < 2; frame += 1) {
            await new Promise((resolve) => {
              requestAnimationFrame(resolve);
            });
          }
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        }, top);

        expect.soft(overflow, `overflow at ${String(width)} px, ${String(top)} px down`).toBe(0);
      }
    }
  });
}
