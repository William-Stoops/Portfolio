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
      // The page as a visitor sees it: a first key press renders the deferred sections
      // (ADR 0018). Left as placeholders, their content overflows the placeholder's size
      // into the footer, and axe measured links covering the form's button.
      await page.keyboard.press('Shift');
      if (route === '/') {
        await expect(page.locator('html')).toHaveAttribute('data-render-all');
      }

      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();

      // Each failing node with its selector and axe's summary: an id alone cannot be
      // debugged from a CI log.
      expect(
        violations.flatMap(({ id, nodes }) =>
          nodes.map(({ target, failureSummary }) => ({
            id,
            target: target.join(' '),
            failure: failureSummary ?? '',
          })),
        ),
      ).toEqual([]);
    });
  }
}
