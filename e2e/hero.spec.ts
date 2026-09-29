import { expect, test } from '@playwright/test';

test.describe('hero', () => {
  test('states the real weight of the downloadable CV', async ({ page, request }) => {
    await page.goto('/fr');
    // The bar's link (the hero and the footer offer the same file).
    const link = page.getByRole('link', { name: /^Télécharger le CV/ }).first();
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();

    const response = await request.get(href ?? '');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    const kilobytes = Math.round((await response.body()).byteLength / 1024);
    await expect(link).toHaveAccessibleName(`Télécharger le CV (PDF, ${String(kilobytes)} Ko)`);
  });

  test('packs the technology strip to the start while it wraps, and spreads it on one line', async ({
    page,
  }) => {
    await page.goto('/fr');
    const strip = page.getByRole('list', { name: 'Technologies', exact: true });

    // Where each line starts, the gaps between its words, and the room left at its end.
    const linesAt = async (width: number) => {
      await page.setViewportSize({ width, height: 900 });
      return strip.evaluate((list) => {
        const style = getComputedStyle(list);
        const box = list.getBoundingClientRect();
        const start = box.left + Number.parseFloat(style.paddingLeft);
        const end = box.right - Number.parseFloat(style.paddingRight);
        const lines = new Map<number, DOMRect[]>();
        for (const item of list.children) {
          const rect = item.getBoundingClientRect();
          lines.set(rect.top, [...(lines.get(rect.top) ?? []), rect]);
        }
        return [...lines.values()].map((words) => ({
          indent: (words[0]?.left ?? start) - start,
          gaps: words.slice(1).map((word, index) => word.left - (words[index]?.right ?? 0)),
          room: end - (words.at(-1)?.right ?? end),
          columnGap: Number.parseFloat(style.columnGap),
        }));
      });
    };

    for (const width of [375, 768]) {
      const lines = await linesAt(width);
      expect(lines.length, `${String(width)} px`).toBeGreaterThan(1);
      for (const { indent, gaps, columnGap } of lines) {
        expect(Math.abs(indent)).toBeLessThanOrEqual(1);
        expect(gaps.every((gap) => Math.abs(gap - columnGap) <= 1)).toBe(true);
      }
    }
    const [line, ...others] = await linesAt(1440);
    expect(others).toHaveLength(0);
    expect(Math.abs(line?.indent ?? Number.NaN)).toBeLessThanOrEqual(1);
    expect(Math.abs(line?.room ?? Number.NaN)).toBeLessThanOrEqual(1);
  });

  test('displays the photo fully loaded', async ({ page }) => {
    await page.goto('/fr');
    const portrait = page.getByRole('img', {
      name: 'Portrait de William Stoops, en veste sombre, dans la lumière du soleil',
    });

    await expect(portrait).toBeVisible();
    await expect
      .poll(() =>
        portrait.evaluate((image) => image instanceof HTMLImageElement && image.naturalWidth),
      )
      .toBeGreaterThan(0);
  });
});
