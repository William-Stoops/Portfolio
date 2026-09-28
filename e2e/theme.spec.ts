import { expect, test } from '@playwright/test';

// Guards the production CSS pipeline: Lightning CSS transpiles light-dark() for older
// browsers, and both colour schemes must still resolve to the validated tokens.
const EXPECTED_COLORS = {
  light: { canvas: 'rgb(255, 255, 255)', foreground: 'rgb(28, 29, 32)' },
  dark: { canvas: 'rgb(20, 21, 23)', foreground: 'rgb(240, 240, 238)' },
} as const;

for (const colorScheme of ['light', 'dark'] as const) {
  test(`follows the ${colorScheme} system preference`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/fr');

    const html = page.locator('html');
    await expect(html).toHaveCSS('background-color', EXPECTED_COLORS[colorScheme].canvas);
    await expect(html).toHaveCSS('color', EXPECTED_COLORS[colorScheme].foreground);
  });
}

test.describe('stored theme preference', () => {
  for (const [storedPreference, systemScheme] of [
    ['dark', 'light'],
    ['light', 'dark'],
  ] as const) {
    test(`applies a stored ${storedPreference} preference over a ${systemScheme} system before first paint`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: systemScheme });
      await page.addInitScript(
        ([key, value]) => {
          localStorage.setItem(key, value);
        },
        ['theme-preference', storedPreference] as const,
      );

      // `domcontentloaded` fires before the React bundle renders: only the inline script ran.
      await page.goto('/fr', { waitUntil: 'domcontentloaded' });

      const html = page.locator('html');
      await expect(html).toHaveAttribute('data-theme', storedPreference);
      await expect(html).toHaveCSS('background-color', EXPECTED_COLORS[storedPreference].canvas);
    });
  }

  test('ignores an invalid stored value', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => {
      localStorage.setItem('theme-preference', 'sepia');
    });

    await page.goto('/fr', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
    await expect(page.locator('html')).toHaveCSS('background-color', EXPECTED_COLORS.dark.canvas);
  });
});
