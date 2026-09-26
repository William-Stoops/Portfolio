import { expect, type Page, test } from '@playwright/test';

import { isMobileLayout, openMenuIfCollapsed, pressTab } from './support/interactions.ts';

// Every focusable stop of the home page, in DOM order (= visual order).
function expectedFocusOrderFor(page: Page): readonly string[] {
  const header = isMobileLayout(page)
    ? ['Menu']
    : [
        'À propos',
        'Parcours',
        'Projets',
        'IA',
        'Compétences',
        'Contact',
        'Thème du système',
        'Thème clair',
        'Thème sombre',
      ];
  return [
    'Aller au contenu principal',
    'William Stoops',
    ...header,
    'Me contacter',
    'Télécharger le CV (PDF, 56 Ko)',
    'Lire la vidéo : Pitch de STAXX au concours Epitech Summit',
    'Ouvrir la vidéo sur YouTube (nouvel onglet)',
    'william.stoops@epitech.eu',
    'LinkedIn (nouvel onglet)',
    'Nom',
    'E-mail',
    'Message',
    'Préparer l’e-mail',
    'william.stoops@epitech.eu',
    'LinkedIn (nouvel onglet)',
    'Accessibilité',
    'Mentions légales',
    'Plan du site',
  ];
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

  test('follows the visual order through header, sections, contact form and footer', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');

    const expectedFocusOrder = expectedFocusOrderFor(page);
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

    for (let step = 0; step < expectedFocusOrderFor(page).length; step += 1) {
      await pressTab(page, browserName);
      const focusState = await page.evaluate(async () => {
        // WebKit scrolls to the focused element asynchronously: measure once it settled.
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
        const element = document.activeElement;
        if (!(element instanceof HTMLElement)) {
          return null;
        }
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        // WCAG 2.4.11 (AA): the focused control must not be *entirely* hidden. Probe the
        // middle of its visible part (a tall textarea is scrolled only to its caret).
        const visibleTop = Math.max(box.top, 0);
        const visibleBottom = Math.min(box.bottom, window.innerHeight);
        const topElement =
          visibleBottom > visibleTop
            ? document.elementFromPoint(box.left + box.width / 2, (visibleTop + visibleBottom) / 2)
            : null;
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
    await openMenuIfCollapsed(page);

    await page.getByRole('button', { name: 'Thème sombre' }).click();
    // The new theme spreads through a view transition: reload once it is applied.
    await expect(page.getByRole('button', { name: 'Thème sombre' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.reload();
    await openMenuIfCollapsed(page);

    await expect(page.getByRole('button', { name: 'Thème sombre' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(27, 31, 42)');
  });
});
