import { expect, test } from '@playwright/test';

// Guards the production CSS pipeline: Lightning CSS transpiles light-dark() for older
// browsers, and both colour schemes must still resolve to the validated tokens.
const EXPECTED_COLORS = {
  light: { canvas: 'rgb(250, 250, 247)', foreground: 'rgb(27, 31, 42)' },
  dark: { canvas: 'rgb(27, 31, 42)', foreground: 'rgb(230, 232, 239)' },
} as const;

for (const colorScheme of ['light', 'dark'] as const) {
  test(`follows the ${colorScheme} system preference`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveCSS('background-color', EXPECTED_COLORS[colorScheme].canvas);
    await expect(html).toHaveCSS('color', EXPECTED_COLORS[colorScheme].foreground);
  });
}
