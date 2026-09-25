import { type BrowserType, expect, type Page, test } from '@playwright/test';

async function pressTab(page: Page, browserName: ReturnType<BrowserType['name']>): Promise<void> {
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
}

test.describe('main navigation', () => {
  test('brings the about section into view', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'À propos' })
      .click();

    await expect(page).toHaveURL(/\/#a-propos$/);
    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
  });

  test('brings the experience section into view', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Parcours' })
      .click();

    await expect(page).toHaveURL(/\/#parcours$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Parcours' })).toBeInViewport();
  });

  test('reaches the about section from another page', async ({ page }) => {
    await page.goto('/page-inexistante');

    await page.getByRole('link', { name: 'À propos' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
  });

  test('continues keyboard navigation from the section, not from the top', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');
    const aboutLink = page.getByRole('link', { name: 'À propos' });
    await aboutLink.focus();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 2, name: 'À propos' })).toBeInViewport();
    await pressTab(page, browserName);

    // The section holds no control: the next stop is the first link after it.
    await expect(page.locator(':focus')).not.toHaveAccessibleName('Parcours');
    await expect(page.locator(':focus')).toHaveAccessibleName('william.stoops@epitech.eu');
  });
});
