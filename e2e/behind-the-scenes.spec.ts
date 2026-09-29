import { expect, type Page, test } from '@playwright/test';

import { waitForHydration } from './support/hydration.ts';

// The value a measure's tile shows, by the measure's name.
function valueOf(page: Page, label: string) {
  return page.locator(`dt:text-is("${label}") + dd`);
}

test.describe('behind the scenes', () => {
  test('is reached from the footer, its heading focused', async ({ page }) => {
    await page.goto('/fr');
    await waitForHydration(page);

    await page
      .getByRole('navigation', { name: 'Pied de page' })
      .getByRole('link', { name: 'Coulisses' })
      .click();

    await expect(page).toHaveURL(/\/fr\/coulisses$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Les coulisses du site' }),
    ).toBeFocused();
  });

  test('arrives prerendered, its measures waiting for a browser to take them', async ({
    request,
  }) => {
    const html = await (await request.get('/fr/coulisses')).text();

    expect(html).toContain('Ce que la CI refuse');
    expect(html).toContain('Mesure en cours');
  });

  test('fills in the measures of this visit, as the browser takes them', async ({ page }) => {
    await page.goto('/fr/coulisses');

    await expect(valueOf(page, 'Premier affichage')).toHaveText(/^[\d\s]+ ms$/);
    await expect(valueOf(page, 'JavaScript téléchargé, compressé')).toHaveText(/^[\d\s]+ Ko$/);
    await expect(valueOf(page, 'Fichiers demandés')).toHaveText(/^\d+$/);
    // Where this browser records it, the largest paint too; otherwise the tile says so.
    await expect(valueOf(page, 'Plus grand élément affiché').first()).toHaveText(
      /^([\d\s]+ ms|Non mesuré par ce navigateur)$/,
    );
  });

  test('reads in English on the English page', async ({ page }) => {
    await page.goto('/en/behind-the-scenes');

    await expect(
      page.getByRole('heading', { level: 2, name: 'What the CI turns down' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'See the code on GitHub (new tab)' }),
    ).toHaveAttribute('href', 'https://github.com/William-Stoops/Portfolio');
  });
});
