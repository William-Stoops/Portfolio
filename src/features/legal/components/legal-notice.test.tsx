import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { LegalNotice } from '@/features/legal/components/legal-notice';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('LegalNotice', () => {
  it('names the publisher and how to reach him', async () => {
    const screen = await render(<LegalNotice />);

    await expect.element(screen.getByRole('heading', { level: 2, name: 'Éditeur' })).toBeVisible();
    expect(screen.container.textContent).toContain('William Stoops');
    await expect
      .element(screen.getByRole('link', { name: 'william.stoops@epitech.eu' }))
      .toHaveAttribute('href', 'mailto:william.stoops@epitech.eu');
  });

  it('identifies the host as the law requires (LCEN article 6)', async () => {
    const screen = await render(<LegalNotice />);

    const text = screen.container.textContent;
    expect(text).toContain('Cloudflare, Inc.');
    expect(text).toContain('101 Townsend Street, San Francisco, California 94107, États-Unis');
    expect(text).toContain('+1 888 993 5273');
  });

  it('states that no personal data is collected and no cookie is set', async () => {
    const screen = await render(<LegalNotice />);

    await expect
      .element(screen.getByRole('heading', { level: 2, name: 'Données personnelles et cookies' }))
      .toBeVisible();
    expect(screen.container.textContent).toContain(
      'Ce site ne collecte aucune donnée personnelle et ne dépose aucun cookie.',
    );
  });

  it('has no axe violations', async () => {
    const screen = await render(<LegalNotice />);

    await expectNoAxeViolations(screen.container);
  });
});
