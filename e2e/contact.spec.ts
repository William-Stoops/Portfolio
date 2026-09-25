import { expect, test } from '@playwright/test';

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    // Record the prepared mailto: link instead of launching a mail client.
    await page.addInitScript(() => {
      window.open = (url) => {
        document.documentElement.dataset['openedUrl'] = String(url);
        return null;
      };
    });
    await page.goto('/#contact');
  });

  test('points out every missing field and focuses the first one', async ({ page }) => {
    await page.getByRole('button', { name: 'Préparer l’e-mail' }).click();

    const name = page.getByRole('textbox', { name: 'Nom' });
    await expect(name).toBeFocused();
    await expect(name).toHaveAccessibleDescription('Erreur : saisissez votre nom.');
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  test('prepares the e-mail and confirms it', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Nom' }).fill('Ada Lovelace');
    await page.getByRole('textbox', { name: 'E-mail' }).fill('ada@example.com');
    await page.getByRole('textbox', { name: 'Message' }).fill('Parlons de votre candidature.');
    await page.getByRole('button', { name: 'Préparer l’e-mail' }).click();

    await expect(page.getByRole('region', { name: 'Contact' }).getByRole('status')).toContainText(
      'Votre messagerie s’ouvre',
    );
    const openedUrl = await page.locator('html').getAttribute('data-opened-url');
    expect(openedUrl).toMatch(/^mailto:william\.stoops@epitech\.eu\?subject=Contact%20depuis/);
  });
});
