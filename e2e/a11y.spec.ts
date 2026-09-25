import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/page-inexistante',
  '/accessibilite',
  '/mentions-legales',
  '/plan-du-site',
] as const;
const COLOR_SCHEMES = ['light', 'dark'] as const;
// `wcag22aa` is required: it is the tag that enables the target-size rule in axe 4.13.
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

for (const colorScheme of COLOR_SCHEMES) {
  for (const route of ROUTES) {
    test(`has no axe violations on ${route} in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();

      expect(violations.map((violation) => violation.id)).toEqual([]);
    });
  }
}
