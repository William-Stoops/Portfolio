import { expect, test } from '@playwright/test';

const ROUTES = ['/'] as const;
const SWEEP_WIDTHS = [320, 360, 375, 414, 600, 768, 900, 1024, 1280, 1440, 1920, 2560];

for (const route of ROUTES) {
  test(`never scrolls horizontally on ${route} from 320 to 2560 px`, async ({ page }) => {
    // The sweep sets its own viewport sizes: running it once is enough.
    test.skip(test.info().project.name !== 'desktop', 'viewport sweep runs on one project');
    await page.goto(route);

    for (const width of SWEEP_WIDTHS) {
      await page.setViewportSize({ width, height: 800 });

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );

      expect.soft(hasHorizontalOverflow, `overflow at ${String(width)} px`).toBe(false);
    }
  });
}
