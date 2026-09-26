import { expect, test } from '@playwright/test';

import { isMobileLayout } from './support/interactions.ts';

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

  test('animates only what the compositor can run off the main thread', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.keyboard.press('End');

    // Anything else (colour, clip-path, stroke…) is recomputed on the main thread at every
    // frame: a first version with 56 such animations broke the Total Blocking Time budget.
    const animatedProperties = await page.evaluate(() => {
      const bookkeeping = new Set(['offset', 'computedOffset', 'easing', 'composite']);
      return [
        ...new Set(
          // Keyframe animations only: transitions are one-off reactions to a hover or a
          // theme switch, 150 to 450 ms long, not work repeated at every frame.
          document.getAnimations().flatMap((animation) =>
            animation instanceof CSSAnimation && animation.effect instanceof KeyframeEffect
              ? animation.effect
                  .getKeyframes()
                  .flatMap((keyframe) => Object.keys(keyframe))
                  .filter((property) => !bookkeeping.has(property))
              : [],
          ),
        ),
      ].toSorted();
    });
    expect(
      animatedProperties.filter(
        (property) => !['opacity', 'rotate', 'scale', 'transform', 'translate'].includes(property),
      ),
    ).toEqual([]);
    expect(animatedProperties.length).toBeGreaterThan(0);
  });

  test('adds the cursor ring for a precise pointer only', async ({ page }) => {
    const chunkRequests: string[] = [];
    page.on('request', (request) => {
      if (/desktop-enhancements-[\w-]+\.js$/.test(request.url())) {
        chunkRequests.push(request.url());
      }
    });

    await page.goto('/');
    await page.mouse.move(400, 300);

    if (isMobileLayout(page)) {
      await page.waitForTimeout(2000);
      expect(chunkRequests).toEqual([]);
      await expect(page.locator('[data-cursor-follower]')).toHaveCount(0);
    } else {
      await expect(page.locator('[data-cursor-follower]')).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
