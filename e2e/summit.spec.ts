import { expect, type Page, test } from '@playwright/test';

import { isMobileLayout } from './support/interactions.ts';

// The Summit closes the STAXX case study: arriving on its anchor renders the deferred
// sections (ADR 0018).
async function openCaseStudy(page: Page): Promise<void> {
  await page.goto('/fr#projets');
  await page.locator('[data-summit-stage]').scrollIntoViewIfNeeded();
}

// Scrolls to a share of the pinned stretch of the scene (0: its track at the top of the
// viewport, 1: its end at the bottom), then lets two frames pass.
async function scrollScene(page: Page, share: number): Promise<void> {
  await page.evaluate(async (target) => {
    const track = document.querySelector('[data-summit-stage]')?.closest('.scene-track');
    if (track === null || track === undefined) {
      return;
    }
    const box = track.getBoundingClientRect();
    const pinned = Math.max(box.height - window.innerHeight, 0);
    window.scrollTo({ top: window.scrollY + box.top + pinned * target, behavior: 'instant' });
    for (let frame = 0; frame < 2; frame += 1) {
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    }
  }, share);
}

// Ten seats per tick of the counter: the ticks fully drawn.
async function takenSeats(page: Page): Promise<number> {
  const opacities = await page
    .locator('[data-seats="taken"]')
    .evaluateAll((ticks) => ticks.map((tick) => Number(getComputedStyle(tick).opacity)));
  return opacities.filter((opacity) => opacity > 0.99).length * 10;
}

async function lightOpacities(page: Page): Promise<number[]> {
  return page
    .locator('[data-summit-light]')
    .evaluateAll((lights) =>
      lights.map((light) =>
        getComputedStyle(light).display === 'none' ? 0 : Number(getComputedStyle(light).opacity),
      ),
    );
}

// The counter as it reads: each strip shows the digit its translation reaches.
async function counterValue(page: Page): Promise<string> {
  return page.locator('[data-digits]').evaluateAll((strips) =>
    strips
      .map((strip) => {
        const [, y = '0'] = getComputedStyle(strip).translate.split(' ');
        const lineHeight = Number.parseFloat(getComputedStyle(strip).fontSize);
        const digits = strip.textContent.split('\n');
        return digits[Math.round(-Number.parseFloat(y) / lineHeight)] ?? '?';
      })
      .join(''),
  );
}

test.describe('Epitech Summit scene', () => {
  test('fills the room, counts to 300, then lights up the winners as it scrolls by', async ({
    page,
  }) => {
    test.skip(isMobileLayout(page), 'the scene is pinned on large screens only');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openCaseStudy(page);

    await scrollScene(page, 0);
    expect(await takenSeats(page)).toBe(0);
    expect(await counterValue(page)).toBe('000');
    // The dark of the room is up; the spots are about to enter.
    expect(Math.max(...(await lightOpacities(page)))).toBeGreaterThan(0.8);

    await scrollScene(page, 0.26);
    const halfway = await takenSeats(page);
    expect(halfway).toBeGreaterThan(50);
    expect(halfway).toBeLessThan(250);
    // A tick of seats counts as taken just before its fade ends, when the counter's digit
    // steps: the counter keeps pace with the seats within one tick of ten.
    await expect
      .poll(async () => Number(await counterValue(page)))
      .toBeGreaterThanOrEqual(halfway - 10);

    await scrollScene(page, 0.5);
    await expect.poll(() => takenSeats(page)).toBe(300);
    await expect.poll(() => counterValue(page)).toBe('300');

    await scrollScene(page, 0.85);
    expect(await lightOpacities(page)).toEqual([0, 0, 0]);
  });

  test('fills the room as it goes by on a phone, the photo lit', async ({ page }) => {
    test.skip(!isMobileLayout(page), 'small screens only');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openCaseStudy(page);
    const room = page.locator('[data-summit-room]');

    await room.evaluate((element) => {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top,
        behavior: 'instant',
      });
    });

    await expect.poll(() => takenSeats(page)).toBe(300);
    await expect.poll(() => counterValue(page)).toBe('300');
    expect(await lightOpacities(page)).toEqual([0, 0, 0]);
  });

  test('stands still, the room full and the winners lit, with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openCaseStudy(page);

    expect(await takenSeats(page)).toBe(300);
    expect(await counterValue(page)).toBe('300');
    expect(await lightOpacities(page)).toEqual([0, 0, 0]);
  });

  test('shows the photo to assistive tech once, the room as decoration', async ({ page }) => {
    await openCaseStudy(page);
    const staxx = page.getByRole('article', { name: 'STAXX' });

    await expect(
      staxx
        .getByRole('figure', { name: /^Epitech Summit/ })
        .getByRole('img', { name: /le trophée de la première place en main/ }),
    ).toHaveCount(1);
    await expect(page.locator('[data-summit-room]')).toHaveAttribute('aria-hidden', 'true');
  });
});
