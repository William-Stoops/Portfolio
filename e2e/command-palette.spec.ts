import { expect, type Page, test } from '@playwright/test';

import { waitForHydration } from './support/hydration.ts';
import { openMenuIfCollapsed, pressQuickSearchShortcut } from './support/interactions.ts';

// The requests for the quick search's own chunk, as they happen.
function paletteChunkRequests(page: Page): string[] {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/\/command-palette-[\w-]+\.js$/.test(request.url())) {
      requests.push(request.url());
    }
  });
  return requests;
}

test.describe('the quick search', () => {
  test('opens with ⌘K or Ctrl+K, finds a page as it is typed, and goes there', async ({ page }) => {
    const chunks = paletteChunkRequests(page);
    await page.goto('/fr');
    await waitForHydration(page);
    // Its code waits until the visitor asks for it.
    expect(chunks).toEqual([]);

    await page.keyboard.press('ControlOrMeta+k');

    const palette = page.getByRole('dialog', { name: 'Recherche rapide' });
    await expect(palette).toBeVisible();
    await expect(palette.getByRole('searchbox')).toBeFocused();
    await page.keyboard.type('coulisses');
    await expect(palette.getByRole('listitem')).toHaveText(['Coulisses']);
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/fr\/coulisses$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Les coulisses du site' }),
    ).toBeFocused();
    await expect(palette).toBeHidden();
    expect(chunks).toHaveLength(1);
  });

  test('opens from its button, and gives the focus back to it on Escape', async ({ page }) => {
    await page.goto('/fr/coulisses');
    await waitForHydration(page);
    await openMenuIfCollapsed(page);
    const trigger = page.getByRole('button', { name: /^Recherche rapide/ });

    await trigger.click();
    const palette = page.getByRole('dialog', { name: 'Recherche rapide' });
    await expect(palette).toBeVisible();
    await page.keyboard.press('Escape');

    await expect(palette).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('reaches a section of the home page from another page', async ({ page }) => {
    await page.goto('/fr/mentions-legales');
    await waitForHydration(page);

    await pressQuickSearchShortcut(page);
    await page.keyboard.type('parcours');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/fr#parcours$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Parcours' })).toBeInViewport();
  });

  test('searches in English on the English page', async ({ page }) => {
    await page.goto('/en');
    await waitForHydration(page);

    await pressQuickSearchShortcut(page);
    await page.keyboard.type('behind');

    await expect(
      page.getByRole('dialog', { name: 'Quick search' }).getByRole('listitem'),
    ).toHaveText(['Behind the scenes']);
  });
});
