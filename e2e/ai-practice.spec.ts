import { expect, test } from '@playwright/test';

test.describe('AI practice', () => {
  test('never lets one practice cover another while the page scrolls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // Arriving on an anchor renders every deferred section (ADR 0018).
    await page.goto('/#ia');
    const cards = page
      .getByRole('region', { name: 'Intelligence artificielle' })
      .getByRole('listitem');
    await expect(cards.first()).toBeAttached();
    const start = await page.evaluate(() => window.scrollY);

    for (let step = 0; step < 20; step += 1) {
      await page.evaluate(
        (y) => {
          window.scrollTo({ top: y, behavior: 'instant' });
        },
        start + step * 80,
      );
      const overlaps = await cards.evaluateAll((items) => {
        const boxes = items.map((item) => item.getBoundingClientRect());
        return boxes.slice(1).filter((box, index) => box.top < (boxes[index]?.bottom ?? 0) - 1)
          .length;
      });
      expect.soft(overlaps, `after ${String(step * 80)} px`).toBe(0);
    }
  });
});
