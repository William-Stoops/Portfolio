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

  it('has no axe violations', async () => {
    const screen = await renderInRouter(<SiteHeader />);

    await expectNoAxeViolations(screen.container);
  });
});
