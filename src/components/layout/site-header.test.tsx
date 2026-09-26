import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { SiteHeader } from '@/components/layout/site-header';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

const SECTION_LINKS = [
  { name: 'À propos', href: '/#a-propos' },
  { name: 'Parcours', href: '/#parcours' },
  { name: 'Corée', href: '/#coree' },
  { name: 'Projets', href: '/#projets' },
  { name: 'IA', href: '/#ia' },
  { name: 'Compétences', href: '/#competences' },
  { name: 'Contact', href: '/#contact' },
];

// Following /#parcours would navigate the test frame away: keep the click, drop the
// navigation. React's click handler still runs.
function preventNavigation(event: MouseEvent): void {
  event.preventDefault();
}

describe('SiteHeader', () => {
  it('is the banner landmark with a home link named after the site owner', async () => {
    const screen = await renderInRouter(<SiteHeader />);

    await expect
      .element(screen.getByRole('banner').getByRole('link', { name: 'William Stoops' }))
      .toHaveAttribute('href', '/');
  });

  describe('on large screens', () => {
    beforeEach(async () => {
      await page.viewport(1024, 800);
    });

    it('shows the main navigation and the theme choice inline, without a menu button', async () => {
      const screen = await renderInRouter(<SiteHeader />);

      const navigation = screen.getByRole('navigation', { name: 'Navigation principale' });
      expect(
        navigation
          .getByRole('link')
          .elements()
          .map((link) => ({ name: link.textContent, href: link.getAttribute('href') })),
      ).toEqual(SECTION_LINKS);
      await expect.element(screen.getByRole('group', { name: 'Thème' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Menu' }).elements()).toHaveLength(0);
    });

    it('keeps every section link on one line, from the narrowest large screen', async () => {
      const screen = await renderInRouter(<SiteHeader />);

      const tops = screen
        .getByRole('navigation', { name: 'Navigation principale' })
        .getByRole('link')
        .elements()
        .map((link) => link.getBoundingClientRect().top);
      expect(new Set(tops).size).toBe(1);
    });

    it('has no axe violations', async () => {
      const screen = await renderInRouter(<SiteHeader />);

      await expectNoAxeViolations(screen.container);
    });
  });

  describe('on small screens', () => {
    beforeEach(async () => {
      await page.viewport(375, 800);
    });

    it('keeps navigation and theme choice behind a collapsed Menu button', async () => {
      const screen = await renderInRouter(<SiteHeader />);

      const button = screen.getByRole('button', { name: 'Menu' });
      await expect.element(button).toHaveAttribute('aria-expanded', 'false');
      await expect.element(button).toHaveAttribute('aria-controls', 'menu-principal');
      expect(
        screen.getByRole('navigation', { name: 'Navigation principale' }).elements(),
      ).toHaveLength(0);
    });

    it('reveals navigation and theme choice when opened', async () => {
      const screen = await renderInRouter(<SiteHeader />);

      await screen.getByRole('button', { name: 'Menu' }).click();

      await expect
        .element(screen.getByRole('button', { name: 'Menu' }))
        .toHaveAttribute('aria-expanded', 'true');
      await expect
        .element(screen.getByRole('navigation', { name: 'Navigation principale' }))
        .toBeVisible();
      await expect.element(screen.getByRole('group', { name: 'Thème' })).toBeVisible();
    });

    it('closes once a section is chosen', async () => {
      document.addEventListener('click', preventNavigation);
      const screen = await renderInRouter(<SiteHeader />);
      await screen.getByRole('button', { name: 'Menu' }).click();

      await screen.getByRole('link', { name: 'Parcours' }).click();

      await expect
        .element(screen.getByRole('button', { name: 'Menu' }))
        .toHaveAttribute('aria-expanded', 'false');
      document.removeEventListener('click', preventNavigation);
    });

    it('offers a menu button at least 44 px high', async () => {
      const screen = await renderInRouter(<SiteHeader />);

      expect(
        screen.getByRole('button', { name: 'Menu' }).element().getBoundingClientRect().height,
      ).toBeGreaterThanOrEqual(44);
    });

    it('has no axe violations, open or closed', async () => {
      const screen = await renderInRouter(<SiteHeader />);
      await expectNoAxeViolations(screen.container);

      await screen.getByRole('button', { name: 'Menu' }).click();

      await expectNoAxeViolations(screen.container);
    });
  });
});
