import { expect, test } from '@playwright/test';

test.describe('document', () => {
  test('declares French as page language', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('has a descriptive title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('William Stoops – Software Engineer & AI Engineer');
  });

  test('describes the page for search engines', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Software Engineer/,
    );
  });

  test('never blocks pinch zoom', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    await expect(viewport).not.toHaveAttribute('content', /maximum-scale|user-scalable/);
  });

  test('renders the main heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'William Stoops' })).toBeVisible();
  });
});
