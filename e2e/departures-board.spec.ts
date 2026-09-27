import { expect, type Locator, type Page, test } from '@playwright/test';

import { waitForHydration } from './support/hydration.ts';
import { isMobileLayout } from './support/interactions.ts';

// What a run of split-flap cells shows right now: for each strip, the glyph its
// translation brings into its cell (one line per glyph).
async function shownText(cells: Locator): Promise<string> {
  return cells.evaluateAll((strips) =>
    strips
      .map((strip) => {
        const style = getComputedStyle(strip);
        const [, y = '0'] = style.translate.split(' ');
        const line = Math.round(-Number.parseFloat(y) / Number.parseFloat(style.lineHeight));
        return strip.textContent.split('\n')[line] ?? '?';
      })
      .join(''),
  );
}

// Scrolls so the top of an element sits `share` of the way down the viewport.
async function placeTop(page: Page, selector: string, share: number): Promise<void> {
  await page.evaluate(
    async ({ target, at }) => {
      const element = document.querySelector(target);
      if (element === null) {
        return;
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - window.innerHeight * at, behavior: 'instant' });
      for (let frame = 0; frame < 2; frame += 1) {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
      }
    },
    { target: selector, at: share },
  );
}

const TITLE_STRIPS = '#annee-2025 h3 [data-flap-character] + *';

// The home page with every section rendered, as a first key press does (ADR 0018), and
// without an anchor: the browser's own scroll to it would land after ours.
async function openJourney(page: Page): Promise<void> {
  await page.goto('/fr');
  await waitForHydration(page);
  await page.keyboard.press('Shift');
  await expect(page.locator('html')).toHaveAttribute('data-render-all');
  await expect(page.locator('#annee-2025 h3')).toBeAttached();
}

test.describe('departures board', () => {
  test('changes the rail’s line as the reader reaches a year, turning the digits that change', async ({
    page,
  }) => {
    test.skip(isMobileLayout(page), 'the rail exists on large screens only');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openJourney(page);
    const board = page.locator('[data-waypoint][style*="--wp-annee-2025"]');
    const value = board.locator('p').first().locator('[data-flap-character] + *');

    // The stop's top just past the reading line (40 % down): the line has taken over, its
    // last digit still turning from 2024's 4.
    await placeTop(page, '#annee-2025', 0.4 - 12 / 900);
    const turning = await shownText(value);
    expect(turning.slice(0, 3)).toBe('202');

    await placeTop(page, '#annee-2025', 0.2);
    expect(await shownText(value)).toBe('2025');
    await expect(board).toHaveCSS('opacity', '1');
  });

  test('turns a stop’s title in, then stops on it before the reading line', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openJourney(page);
    test.skip(
      !(await page.evaluate(() => CSS.supports('animation-timeline: view()'))),
      'without scroll-driven animations the titles simply stand (Playwright’s WebKit)',
    );
    const strips = page.locator(TITLE_STRIPS);

    await placeTop(page, '#annee-2025 h3', 0.97);
    expect(await shownText(strips)).not.toBe('RetourenFrance');

    await placeTop(page, '#annee-2025 h3', 0.5);
    expect(await shownText(strips)).toBe('RetourenFrance');
  });

  test('shows every title and the rail at rest with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openJourney(page);

    await placeTop(page, '#annee-2025 h3', 0.97);
    expect(await shownText(page.locator(TITLE_STRIPS))).toBe('RetourenFrance');
    await expect(page.getByRole('heading', { level: 3, name: 'Retour en France' })).toBeVisible();
  });
});
