import { describe, expect, it } from 'vitest';

import { FOOTER_LINKS, NAV_ITEMS } from '@/config/navigation';
import { SiteMap } from '@/features/legal/components/site-map';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

describe('SiteMap', () => {
  it('lists the home page with every section of the main navigation', async () => {
    const screen = await renderInRouter(<SiteMap />);

    await expect
      .element(screen.getByRole('link', { name: 'Accueil' }))
      .toHaveAttribute('href', '/');
    for (const { label, href } of NAV_ITEMS) {
      expect(
        screen.getByRole('link', { name: label, exact: true }).element().getAttribute('href'),
      ).toBe(href);
    }
  });

  it('lists every other page of the site', async () => {
    const screen = await renderInRouter(<SiteMap />);

    for (const { label, path } of FOOTER_LINKS) {
      expect(
        screen.getByRole('link', { name: label, exact: true }).element().getAttribute('href'),
      ).toBe(path);
    }
  });

  it('has no axe violations', async () => {
    const screen = await renderInRouter(<SiteMap />);

    await expectNoAxeViolations(screen.container);
  });
});
