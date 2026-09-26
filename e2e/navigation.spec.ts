import { expect, test } from '@playwright/test';

import { openMenuIfCollapsed, pressTab } from './support/interactions.ts';

test.describe('main navigation', () => {
  test('brings the about section into view', async ({ page }) => {
    await page.goto('/');
    await openMenuIfCollapsed(page);

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'À propos' })
      .click();

    await expect(page).toHaveURL(/\/#a-propos$/);
    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
  });

  test('brings the experience section into view', async ({ page }) => {
    await page.goto('/');
    await openMenuIfCollapsed(page);

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Parcours' })
      .click();

    await expect(page).toHaveURL(/\/#parcours$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Parcours' })).toBeInViewport();
  });

  for (const { link, heading, hash } of [
    { link: 'Projets', heading: 'Projets', hash: 'projets' },
    { link: 'IA', heading: 'IA\u00A0: pratique personnelle et travaux académiques', hash: 'ia' },
    { link: 'Corée', heading: 'Corée du Sud', hash: 'coree' },
    { link: 'Compétences', heading: 'Compétences et formation', hash: 'competences' },
    { link: 'Contact', heading: 'Contact', hash: 'contact' },
  ]) {
    test(`brings the ${link} section into view`, async ({ page }) => {
      await page.goto('/');
      await openMenuIfCollapsed(page);

      await page
        .getByRole('navigation', { name: 'Navigation principale' })
        .getByRole('link', { name: link, exact: true })
        .click();

      await expect(page).toHaveURL(new RegExp(`/#${hash}$`));
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeInViewport();
    });
  }

  test('reaches the about section from another page', async ({ page }) => {
    await page.goto('/page-inexistante');
    await openMenuIfCollapsed(page);

    await page.getByRole('link', { name: 'À propos' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
  });

  test('continues keyboard navigation from the section, not from the top', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');
    await openMenuIfCollapsed(page);
    const aboutLink = page.getByRole('link', { name: 'À propos' });
    await aboutLink.focus();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
    await pressTab(page, browserName);

    // The sections after it hold no control until the projects' video: that is the next stop.
    await expect(page.locator(':focus')).toHaveAccessibleName(
      'Lire la vidéo : Pitch de STAXX au concours Epitech Summit',
    );
  });
});

test.describe('footer navigation', () => {
  test('opens a legal page with its heading focused', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Pied de page' })
      .getByRole('link', { name: 'Mentions légales' })
      .click();

    await expect(page).toHaveURL(/\/mentions-legales$/);
    await expect(page).toHaveTitle('Mentions légales – William Stoops');
    await expect(page.getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeFocused();
  });

  test('leads from the site map back to a home section', async ({ page }) => {
    await page.goto('/plan-du-site');

    await page.getByRole('main').getByRole('link', { name: 'Parcours' }).click();

    await expect(page).toHaveURL(/\/#parcours$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Parcours' })).toBeInViewport();
  });
});
