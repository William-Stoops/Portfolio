import { expect, type Page, test } from '@playwright/test';

// Where the hero's photo sits, under its text on a phone, once the page has settled: in
// Inter Tight at the weights over the photo, or in the stand-in where the font never comes.
async function photoTop(page: Page, path: string): Promise<number> {
  await page.goto(path);
  await page.evaluate(async () => {
    await Promise.allSettled(
      ['400', '500', '650'].map((weight) =>
        document.fonts.load(`${weight} 1rem "Inter Tight Variable"`),
      ),
    );
    await document.fonts.ready;
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  });
  return page
    .getByRole('img', { name: /^Portrait de William Stoops|^Portrait of William Stoops/ })
    .evaluate((image) => image.getBoundingClientRect().top + window.scrollY);
}

test.describe('font swap', () => {
  // The texts over the photo are set in Inter Tight, the lead at 400, the headline at 650:
  // the local face that stands in while it loads must wrap them the same, or the photo
  // moves when the font arrives (a layout shift).
  for (const path of ['/fr', '/en']) {
    for (const width of [360, 412]) {
      test(`keeps the photo in place on ${path} at ${String(width)} px when Inter Tight arrives`, async ({
        browser,
      }) => {
        // Two contexts: a page sharing the first one's cache would find the font there. No
        // motion: the photo's entrance would move it while it is measured.
        const options = { viewport: { width, height: 800 }, reducedMotion: 'reduce' } as const;
        const withFont = await browser.newContext(options);
        const withoutFont = await browser.newContext(options);
        await withoutFont.route(/\.woff2$/, (route) => route.abort());

        const [inFont, inStandIn] = await Promise.all([
          photoTop(await withFont.newPage(), path),
          photoTop(await withoutFont.newPage(), path),
        ]);

        expect(Math.abs(inStandIn - inFont)).toBeLessThanOrEqual(1);
        await Promise.all([withFont.close(), withoutFont.close()]);
      });
    }
  }
});
