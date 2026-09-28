import { expect, type Page, test } from '@playwright/test';

import { waitForHydration } from './support/hydration.ts';

type ClockAnimation = { name: string; endTime: number; isRunning: boolean };

// The keyframe animations the page plays on its own, on the clock (scroll-driven ones
// follow the scroll; transitions answer the visitor): their keyframes,
// when each ends, in milliseconds from the start of the document, and whether it runs.
async function clockAnimations(page: Page): Promise<ClockAnimation[]> {
  return page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (animation): animation is CSSAnimation =>
          animation instanceof CSSAnimation && animation.timeline === document.timeline,
      )
      .map((animation) => {
        const endTime = animation.effect?.getComputedTiming().endTime;
        return {
          name: animation.animationName,
          endTime: typeof endTime === 'number' ? endTime : Number.POSITIVE_INFINITY,
          isRunning: animation.playState === 'running',
        };
      }),
  );
}

test.describe('not-found page', () => {
  test('tells the visitor their flight is diverted and offers other destinations', async ({
    page,
  }) => {
    await page.goto('/fr/page-inexistante');

    await expect(page.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeVisible();
    await expect(page.getByText('Vol 404, dérouté')).toBeAttached();
    const destinations = page.getByRole('navigation', { name: 'Autres destinations' });
    await expect(destinations.getByRole('link')).toHaveText([
      'Accueil',
      'Parcours',
      'Contact',
      'Plan du site',
    ]);

    await waitForHydration(page);
    await destinations.getByRole('link', { name: 'Plan du site' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Plan du site' })).toBeFocused();
  });

  test('leads an English reader to the English pages', async ({ page }) => {
    await page.goto('/en/nowhere');

    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.getByText('Flight 404, diverted')).toBeAttached();
    await expect(
      page.getByRole('navigation', { name: 'Other destinations' }).getByRole('link'),
    ).toHaveText(['Home', 'Journey', 'Contact', 'Site map']);
  });

  test('flies the plane round, and has it waiting within five seconds (WCAG 2.2.2)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/fr/page-inexistante');

    const animations = await clockAnimations(page);
    // The plane's turns, and the board's cells turning in.
    expect(new Set(animations.map(({ name }) => name))).toEqual(new Set(['holding', 'roll-up']));
    expect(Math.max(...animations.map(({ endTime }) => endTime))).toBeLessThanOrEqual(5000);
  });

  test('keeps the page still when the visitor asks for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/fr/page-inexistante');

    await expect(page.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeVisible();
    await expect
      .poll(async () => (await clockAnimations(page)).filter(({ isRunning }) => isRunning))
      .toEqual([]);
  });
});
