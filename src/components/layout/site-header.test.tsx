import { describe, expect, it } from 'vitest';

import { SiteHeader } from '@/components/layout/site-header';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

describe('SiteHeader', () => {
  it('is the banner landmark with a home link named after the site owner', async () => {
    const screen = await renderInRouter(<SiteHeader />);

    const banner = screen.getByRole('banner');
    await expect
      .element(banner.getByRole('link', { name: 'William Stoops' }))
      .toHaveAttribute('href', '/');
  });

  it('offers the theme choice', async () => {
    const screen = await renderInRouter(<SiteHeader />);

    await expect.element(screen.getByRole('group', { name: 'Thème' })).toBeVisible();
  });

  it('links to the page sections from the main navigation', async () => {
    const screen = await renderInRouter(<SiteHeader />);

    const navigation = screen.getByRole('navigation', { name: 'Navigation principale' });
    await expect
      .element(navigation.getByRole('link', { name: 'À propos' }))
      .toHaveAttribute('href', '/#a-propos');
    await expect
      .element(navigation.getByRole('link', { name: 'Parcours' }))
      .toHaveAttribute('href', '/#parcours');
  });

  it('has no axe violations', async () => {
    const screen = await renderInRouter(<SiteHeader />);

    await expectNoAxeViolations(screen.container);
  });
});
