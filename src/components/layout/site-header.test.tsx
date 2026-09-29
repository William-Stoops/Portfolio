import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { SiteHeader } from '@/components/layout/site-header';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

const SECTION_LINKS = [
  { name: 'Parcours', href: '/fr#parcours' },
  { name: 'IA', href: '/fr#ia' },
  { name: 'Compétences', href: '/fr#competences' },
  { name: 'Contact', href: '/fr#contact' },
];

// Following /fr#parcours would navigate the test frame away: keep the click, drop the
// navigation. React's click handler still runs.
function preventNavigation(event: MouseEvent): void {
  event.preventDefault();
}

describe('SiteHeader', () => {
  it('is the banner landmark with a home link named after the site owner', async () => {
    const screen = await renderInRouter(<SiteHeader tone="page" />);

    await expect
      .element(screen.getByRole('banner').getByRole('link', { name: 'William Stoops' }))
      .toHaveAttribute('href', '/fr');
  });

  it('offers the CV from the bar, with its format and weight in the name', async () => {
    const screen = await renderInRouter(<SiteHeader tone="page" />);

    const link = screen
      .getByRole('banner')
      .getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' });
    await expect.element(link).toHaveAttribute('href', '/cv/william-stoops-cv-fr.pdf');
    await expect.element(link).toHaveAttribute('download');
  });

  it('lies over the hero, letting its field show through', async () => {
    const screen = await renderInRouter(<SiteHeader tone="hero" />);

    const style = getComputedStyle(screen.getByRole('banner').element());
    expect(style.position).toBe('absolute');
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it.each([375, 1280])(
    'keeps the menu in the bar at %i px, a target a finger can hit',
    async (width) => {
      await page.viewport(width, 800);
      const screen = await renderInRouter(<SiteHeader tone="page" />);

      const button = screen.getByRole('banner').getByRole('button', { name: 'Menu' });
      await expect.element(button).toBeVisible();
      const box = button.element().getBoundingClientRect();
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
    },
  );

  describe('on large screens', () => {
    beforeEach(async () => {
      await page.viewport(1280, 800);
    });

    it('shows the section links in the bar, then the CV', async () => {
      const screen = await renderInRouter(<SiteHeader tone="page" />);

      const navigation = screen
        .getByRole('banner')
        .getByRole('navigation', { name: 'Navigation principale' });
      expect(
        navigation
          .getByRole('link')
          .elements()
          .map((link) => ({ name: link.textContent, href: link.getAttribute('href') })),
      ).toEqual(SECTION_LINKS);
      expect(
        screen
          .getByRole('banner')
          .getByRole('link')
          .elements()
          .map((link) => link.getAttribute('aria-label') ?? link.textContent),
      ).toEqual([
        'William Stoops',
        ...SECTION_LINKS.map(({ name }) => name),
        'Télécharger le CV (PDF, 56 Ko)',
      ]);
    });

    it('has no axe violations', async () => {
      const screen = await renderInRouter(<SiteHeader tone="page" />);

      await expectNoAxeViolations(screen.container);
    });
  });

  describe('on small screens', () => {
    beforeEach(async () => {
      await page.viewport(375, 800);
    });

    it('keeps the navigation behind the Menu button', async () => {
      const screen = await renderInRouter(<SiteHeader tone="page" />);

      const button = screen.getByRole('button', { name: 'Menu' });
      await expect.element(button).toHaveAttribute('aria-haspopup', 'dialog');
      await expect.element(button).toHaveAttribute('aria-expanded', 'false');
      expect(
        screen.getByRole('navigation', { name: 'Navigation principale' }).elements(),
      ).toHaveLength(0);
    });

    it('opens a menu with the sections, the search, the theme and the other language', async () => {
      const screen = await renderInRouter(<SiteHeader tone="page" />);

      await screen.getByRole('button', { name: 'Menu' }).click();

      const menu = screen.getByRole('dialog', { name: 'Menu' });
      await expect.element(menu).toBeVisible();
      expect(
        menu
          .getByRole('navigation', { name: 'Navigation principale' })
          .getByRole('link')
          .elements()
          .map((link) => link.getAttribute('href')),
      ).toEqual(SECTION_LINKS.map(({ href }) => href));
      await expect.element(menu.getByRole('button', { name: /^Recherche rapide/ })).toBeVisible();
      await expect.element(menu.getByRole('group', { name: 'Thème' })).toBeVisible();
      await expect.element(menu.getByRole('link', { name: 'English' })).toBeVisible();
    });

    it('closes on Escape and gives the focus back to its button', async () => {
      const screen = await renderInRouter(<SiteHeader tone="page" />);
      await screen.getByRole('button', { name: 'Menu' }).click();
      await expect.element(screen.getByRole('dialog', { name: 'Menu' })).toBeVisible();

      await userEvent.keyboard('{Escape}');

      expect(screen.getByRole('dialog', { name: 'Menu' }).elements()).toHaveLength(0);
      await expect.element(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
    });

    it('closes once a section is chosen', async () => {
      document.addEventListener('click', preventNavigation);
      const screen = await renderInRouter(<SiteHeader tone="page" />);
      await screen.getByRole('button', { name: 'Menu' }).click();

      await screen.getByRole('dialog').getByRole('link', { name: 'Parcours' }).click();

      expect(screen.getByRole('dialog', { name: 'Menu' }).elements()).toHaveLength(0);
      await expect
        .element(screen.getByRole('button', { name: 'Menu' }))
        .toHaveAttribute('aria-expanded', 'false');
      document.removeEventListener('click', preventNavigation);
    });

    it('has no axe violations, open or closed', async () => {
      const screen = await renderInRouter(<SiteHeader tone="page" />);
      await expectNoAxeViolations(screen.container);

      await screen.getByRole('button', { name: 'Menu' }).click();
      // The menu drops in with a fade: its contrast is measured once it has settled.
      const menu = screen.getByRole('dialog', { name: 'Menu' }).element();
      await Promise.all(menu.getAnimations().map(async (animation) => animation.finished));

      await expectNoAxeViolations(screen.container);
    });
  });

  it('speaks English on an English page', async () => {
    await page.viewport(1280, 800);
    const screen = await renderInRouter(<SiteHeader tone="page" />, {
      path: '/en',
      locale: 'en',
    });

    await expect
      .element(screen.getByRole('link', { name: 'William Stoops' }))
      .toHaveAttribute('href', '/en');
    expect(
      screen
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link')
        .elements()
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/en#journey', '/en#ai', '/en#skills', '/en#contact']);
    await expect
      .element(screen.getByRole('link', { name: 'Download my CV (PDF in French, 56 KB)' }))
      .toBeVisible();
  });
});
