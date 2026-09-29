import { expect, type Locator, type Page, test } from '@playwright/test';

// The lab under the IT-Finance role: its surface starts as the visitor reaches it.
async function openLab(page: Page, path: string, figureName: string): Promise<Locator> {
  await page.goto(path);
  const figure = page.getByRole('figure', { name: figureName });
  // Sections render as the visitor moves (ADR 0018): scroll until the page settles.
  await expect(async () => {
    await figure.evaluate((element) => {
      element.scrollIntoView({ block: 'center' });
    });
    await expect(figure).toBeInViewport({ ratio: 0.8, timeout: 500 });
  }).toPass();
  return figure;
}

// How many of the surface's pixels are painted: its canvas is drawn in 2D.
function paintedShare(figure: Locator): Promise<number> {
  return figure.locator('canvas').evaluate((canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) {
      return 0;
    }
    const context = canvas.getContext('2d');
    const data = context?.getImageData(0, 0, canvas.width, canvas.height).data ?? [];
    let painted = 0;
    for (let index = 3; index < data.length; index += 4) {
      if ((data[index] ?? 0) > 0) {
        painted += 1;
      }
    }
    return painted / (data.length / 4);
  });
}

test.describe('the volatility lab', () => {
  test('solves the surface in the browser and draws it', async ({ page }) => {
    const figure = await openLab(page, '/fr', 'Surface de volatilité implicite');

    await expect.poll(() => paintedShare(figure), { timeout: 8000 }).toBeGreaterThan(0.2);
  });

  test('turns the surface with its buttons', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const figure = await openLab(page, '/fr', 'Surface de volatilité implicite');
    await expect.poll(() => paintedShare(figure)).toBeGreaterThan(0.2);
    const before = await figure.locator('canvas').screenshot();

    await figure.getByRole('button', { name: 'Tourner à droite' }).click();
    await figure.getByRole('button', { name: 'Tourner à droite' }).click();

    await expect
      .poll(async () => (await figure.locator('canvas').screenshot()).equals(before))
      .toBe(false);
  });

  test('speaks English on the English page', async ({ page }) => {
    const figure = await openLab(page, '/en', 'Implied volatility surface');

    await expect(figure.getByRole('group', { name: 'Turn the surface' })).toBeVisible();
  });
});
