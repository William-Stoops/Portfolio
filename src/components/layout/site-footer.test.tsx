import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { SiteFooter } from '@/components/layout/site-footer';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('SiteFooter', () => {
  it('is the contentinfo landmark', async () => {
    const screen = await render(<SiteFooter />);

    await expect.element(screen.getByRole('contentinfo')).toBeVisible();
  });

  it('links to the e-mail address shown in full', async () => {
    const screen = await render(<SiteFooter />);

    await expect
      .element(screen.getByRole('link', { name: 'william.stoops@epitech.eu' }))
      .toHaveAttribute('href', 'mailto:william.stoops@epitech.eu');
  });

  it('opens LinkedIn in a new tab and says so', async () => {
    const screen = await render(<SiteFooter />);
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn (nouvel onglet)' });

    await expect
      .element(linkedIn)
      .toHaveAttribute('href', 'https://www.linkedin.com/in/william-stoops-a1029b233');
    await expect.element(linkedIn).toHaveAttribute('target', '_blank');
    await expect.element(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('gives every link a target of at least 24 px high', async () => {
    const screen = await render(<SiteFooter />);

    for (const link of screen.getByRole('link').elements()) {
      expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
    }
  });

  it('has no axe violations', async () => {
    const screen = await render(<SiteFooter />);

    await expectNoAxeViolations(screen.container);
  });
});
