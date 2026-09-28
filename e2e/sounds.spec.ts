import { expect, type Page, test } from '@playwright/test';

import { renderEverySection, waitForHydration } from './support/hydration.ts';

// The requests for the synthesiser's own chunk, as they happen.
function synthesiserRequests(page: Page): string[] {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/\/sound-engine-[\w-]+\.js$/.test(request.url())) {
      requests.push(request.url());
    }
  });
  return requests;
}

function soundToggle(page: Page) {
  return page.getByRole('contentinfo').getByRole('button', { name: 'Sons' });
}

// The page as it will stay: every section rendered, so the footer does not move under the
// click (reaching it would render the sections), and the footer's toggle hydrated.
async function openHome(page: Page): Promise<void> {
  await page.goto('/fr');
  await renderEverySection(page);
  await waitForHydration(page, 'footer button');
}

test.describe('the sounds', () => {
  test('stay off, loading nothing, until the visitor turns them on', async ({ page }) => {
    const requests = synthesiserRequests(page);
    await openHome(page);
    await expect(soundToggle(page)).toHaveAttribute('aria-pressed', 'false');

    // A gesture that would sound, the sounds off: the synthesiser stays where it is.
    await page.keyboard.press('ControlOrMeta+k');
    await expect(page.getByRole('searchbox')).toBeFocused();
    await page.keyboard.press('Escape');
    expect(requests).toEqual([]);

    await soundToggle(page).click();

    await expect(soundToggle(page)).toHaveAttribute('aria-pressed', 'true');
    // The tap that says they are on.
    await expect.poll(() => requests.length).toBe(1);
  });

  test('keep the visitor’s choice for the next visit', async ({ page }) => {
    await openHome(page);
    await soundToggle(page).click();
    await expect(soundToggle(page)).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await waitForHydration(page, 'footer button');

    await expect(soundToggle(page)).toHaveAttribute('aria-pressed', 'true');
  });
});
