import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { LegalNotice as LegalNoticeEn } from '@/features/legal/components/legal-notice.en';
import { LegalNotice } from '@/features/legal/components/legal-notice.fr';
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

  it('mentions the language choice among what the browser stores', async () => {
    const screen = await render(<LegalNotice />);

    expect(screen.container.textContent).toContain('celui de la langue');
  });

  it('translates the notice, saying the French one prevails', async () => {
    const screen = await render(<LegalNoticeEn />);

    const text = screen.container.textContent;
    await expect
      .element(screen.getByRole('heading', { level: 2, name: 'Publisher' }))
      .toBeVisible();
    expect(text).toContain('101 Townsend Street, San Francisco, California 94107, United States');
    expect(text).toContain('This site collects no personal data and sets no cookies.');
    await expect.element(screen.getByText('mentions légales')).toHaveAttribute('lang', 'fr');
  });

  it.each([
    [
      <LegalNotice key="fr" />,
      'Continents du globe d’après Natural Earth, dans le domaine public.',
    ],
    [
      <LegalNoticeEn key="en" />,
      'The globe’s continents are drawn from Natural Earth, in the public domain.',
    ],
  ])('credits the map the globe is drawn from (%#)', async (notice, credit) => {
    const screen = await render(notice);

    expect(screen.container.textContent).toContain(credit);
  });

  it('has no axe violations', async () => {
    const screen = await render(<LegalNotice />);

    await expectNoAxeViolations(screen.container);
  });
});
