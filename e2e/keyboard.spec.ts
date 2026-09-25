import { type BrowserType, expect, type Page, test } from '@playwright/test';

// Safari only puts links in the Tab order with Option+Tab (or a preference turned on):
// send the key a Safari keyboard user actually presses.
async function pressTab(page: Page, browserName: ReturnType<BrowserType['name']>): Promise<void> {
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
}

test.describe('keyboard navigation', () => {
  test('starts with a visible skip link that moves focus to the main content', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');

    await pressTab(page, browserName);
    const skipLink = page.getByRole('link', { name: 'Aller au contenu principal' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('follows the visual order: skip link, header, hero calls to action, footer', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');

    const expectedFocusOrder = [
      'Aller au contenu principal',
      'William Stoops',
      'À propos',
      'Parcours',
      'Thème du système',
      'Thème clair',
      'Thème sombre',
      'Me contacter',
      'Télécharger le CV (PDF, 56 Ko)',
      'william.stoops@epitech.eu',
      'LinkedIn (nouvel onglet)',
    ];
    for (const name of expectedFocusOrder) {
      await pressTab(page, browserName);
      await expect(page.locator(':focus')).toHaveAccessibleName(name);
    }
  });

  test('keeps every focused control visibly outlined and unobscured (WCAG 2.4.7, 2.4.11)', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');

    for (let step = 0; step < 11; step += 1) {
      await pressTab(page, browserName);
      const focusState = await page.evaluate(() => {
        const element = document.activeElement;
        if (!(element instanceof HTMLElement)) {
          return null;
        }
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        const topElement = document.elementFromPoint(
          box.left + box.width / 2,
          box.top + box.height / 2,
        );
        return {
          name: element.textContent,
          hasOutline: style.outlineStyle === 'solid' && Number.parseFloat(style.outlineWidth) >= 2,
          isUnobscured: topElement !== null && element.contains(topElement),
        };
      });

      expect(focusState, `nothing focused at step ${String(step)}`).not.toBeNull();
      expect.soft(focusState?.hasOutline, `no outline on ${focusState?.name ?? ''}`).toBe(true);
      expect.soft(focusState?.isUnobscured, `obscured: ${focusState?.name ?? ''}`).toBe(true);
    }
  });
});

test.describe('pages', () => {
  test('serves the not-found page for an unknown URL', async ({ page }) => {
    await page.goto('/page-inexistante');

    await expect(page.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeVisible();
    await expect(page).toHaveTitle('Page introuvable – William Stoops');
  });

  test('remembers the chosen theme across reloads', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.getByRole('button', { name: 'Thème sombre' }).click();
    await page.reload();

    await expect(page.getByRole('button', { name: 'Thème sombre' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(27, 31, 42)');
  });
});
