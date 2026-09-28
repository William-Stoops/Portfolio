import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { renderEverySection } from './support/hydration.ts';

const ROUTES = [
  '/fr',
  '/fr/page-inexistante',
  '/fr/accessibilite',
  '/fr/mentions-legales',
  '/fr/plan-du-site',
  '/en',
  '/en/nowhere',
  '/en/accessibility',
  '/en/legal-notice',
  '/en/site-map',
] as const;
const HOME_ROUTES = new Set<string>(['/fr', '/en']);
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
      await renderEverySection(page);
      if (HOME_ROUTES.has(route)) {
        // The journey's code loads on demand (ADR 0020): let it arrive and hydrate, or axe
        // may measure nodes React is replacing (detached, they have no colour of their own).
        await page.waitForLoadState('networkidle');
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
