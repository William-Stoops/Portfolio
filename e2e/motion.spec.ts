import { expect, test } from '@playwright/test';

test.describe('motion', () => {
  test('keeps the whole home page still when the visitor asks for reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Scroll through every section: scroll-driven animations would start on the way.
    await page.keyboard.press('End');

    // The base reset shortens any stray animation to 0.01 ms: nothing may keep running.
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.getAnimations().filter((animation) => animation.playState === 'running')
              .length,
        ),
      )
      .toBe(0);
    await expect(page.getByRole('button', { name: 'Mettre en pause le défilement' })).toBeHidden();
  });

  test('scrolls the technology band until the visitor pauses it (WCAG 2.2.2)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const band = page.getByRole('list', { name: 'Technologies', exact: true }).locator('..');
    const playStates = () =>
      band.evaluate((track) => track.getAnimations().map((animation) => animation.playState));

    await expect.poll(playStates).toEqual(['running']);
    // Away from the band: hovering it pauses it too.
    await page.mouse.move(0, 0);
    await page.getByRole('button', { name: 'Mettre en pause le défilement' }).click();

    await expect.poll(playStates).toEqual(['paused']);
    await page.getByRole('button', { name: 'Reprendre le défilement' }).click();
    await expect.poll(playStates).toEqual(['running']);
  });

  test('keeps the header in view while the page scrolls', async ({ page }) => {
    await page.goto('/#contact');

    await expect(page.getByRole('banner')).toBeInViewport();
  });
});
