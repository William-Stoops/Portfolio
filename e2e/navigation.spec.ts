import { expect, test } from '@playwright/test';

import { openMenuIfCollapsed, pressTab } from './support/interactions.ts';

test.describe('main navigation', () => {
  test('brings the about section into view', async ({ page }) => {
    await page.goto('/fr');
    await openMenuIfCollapsed(page);

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'À propos' })
      .click();

    await expect(page).toHaveURL(/\/fr#a-propos$/);
    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
  });

  test('brings the experience section into view', async ({ page }) => {
    await page.goto('/fr');
    await openMenuIfCollapsed(page);

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Parcours' })
      .click();

    await expect(page).toHaveURL(/\/fr#parcours$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Parcours' })).toBeInViewport();
  });

  for (const { link, heading, level, hash } of [
    {
      link: 'IA',
      heading: 'Intelligence artificielle',
      level: 2,
      hash: 'ia',
    },
    { link: 'Compétences', heading: 'Compétences et formation', level: 2, hash: 'competences' },
    { link: 'Contact', heading: 'Contact', level: 2, hash: 'contact' },
  ]) {
    test(`brings the ${link} section into view`, async ({ page }) => {
      await page.goto('/fr');
      await openMenuIfCollapsed(page);

      await page
        .getByRole('navigation', { name: 'Navigation principale' })
        .getByRole('link', { name: link, exact: true })
        .click();

      await expect(page).toHaveURL(new RegExp(`/fr#${hash}$`));
      await expect(page.getByRole('heading', { level, name: heading })).toBeInViewport();
    });
  }

  test('reaches the about section from another page', async ({ page }) => {
    await page.goto('/fr/page-inexistante');
    await openMenuIfCollapsed(page);

    await page.getByRole('link', { name: 'À propos' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
  });

  test('continues keyboard navigation from the section, not from the top', async ({
    page,
    browserName,
  }) => {
    await page.goto('/fr');
    await openMenuIfCollapsed(page);
    const aboutLink = page.getByRole('link', { name: 'À propos' });
    await aboutLink.focus();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
    await pressTab(page, browserName);

    // The sections after it hold no control until the lab under the IT-Finance role: its
    // first button, which turns the surface, is the next stop.
    await expect(page.locator(':focus')).toHaveAccessibleName('Tourner à gauche');
  });
});

test.describe('footer navigation', () => {
  test('opens a legal page with its heading focused', async ({ page }) => {
    await page.goto('/fr');

    await page
      .getByRole('navigation', { name: 'Pied de page' })
      .getByRole('link', { name: 'Mentions légales' })
      .click();

    await expect(page).toHaveURL(/\/fr\/mentions-legales$/);
    await expect(page).toHaveTitle('Mentions légales – William Stoops');
    await expect(page.getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeFocused();
  });

  test('leads from the site map back to a home section', async ({ page }) => {
    await page.goto('/fr/plan-du-site');

    await page.getByRole('main').getByRole('link', { name: 'Parcours' }).click();

    await expect(page).toHaveURL(/\/fr#parcours$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Parcours' })).toBeInViewport();
  });
});
