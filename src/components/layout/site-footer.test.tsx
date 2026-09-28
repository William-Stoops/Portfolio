import { describe, expect, it } from 'vitest';

import { SiteFooter } from '@/components/layout/site-footer';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter, renderRoutes } from '@/testing/render-with-router';

describe('SiteFooter', () => {
  it('is the contentinfo landmark', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    await expect.element(screen.getByRole('contentinfo')).toBeVisible();
  });

  it('links to the e-mail address shown in full', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    await expect
      .element(screen.getByRole('link', { name: 'william.stoops@epitech.eu' }))
      .toHaveAttribute('href', 'mailto:william.stoops@epitech.eu');
  });

  it('opens LinkedIn in a new tab and says so', async () => {
    const screen = await renderInRouter(<SiteFooter />);
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn (nouvel onglet)' });

    await expect
      .element(linkedIn)
      .toHaveAttribute('href', 'https://www.linkedin.com/in/william-stoops-a1029b233');
    await expect.element(linkedIn).toHaveAttribute('target', '_blank');
    await expect.element(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('gives every link a target of at least 24 px high', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    for (const link of screen.getByRole('link').elements()) {
      expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
    }
  });

  it('links to the legal pages and the site map from a labelled navigation', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    const navigation = screen.getByRole('navigation', { name: 'Pied de page' });
    expect(
      navigation
        .getByRole('link')
        .elements()
        .map((link) => ({ name: link.textContent, href: link.getAttribute('href') })),
    ).toEqual([
      { name: 'Accessibilité', href: '/accessibilite' },
      { name: 'Mentions légales', href: '/mentions-legales' },
      { name: 'Plan du site', href: '/plan-du-site' },
    ]);
  });

  it('marks the link to the current page', async () => {
    const screen = await renderRoutes(
      [{ path: '*', element: <SiteFooter /> }],
      '/mentions-legales',
    );
    const navigation = screen.getByRole('navigation', { name: 'Pied de page' });

    await expect
      .element(navigation.getByRole('link', { name: 'Mentions légales' }))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(navigation.getByRole('link', { name: 'Plan du site' }))
      .not.toHaveAttribute('aria-current');
  });

  it('signs off with the name in giant letters, as decoration', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    const wordmark = screen.container.querySelector('[data-wordmark]');
    expect(wordmark?.getAttribute('aria-hidden')).toBe('true');
    expect(wordmark?.textContent.replaceAll(' ', '')).toBe('WilliamStoops');
  });

  it('signs off with the profile sentence and a way back to the top', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    await expect
      .element(screen.getByText('Je décide d’une architecture, je la mesure, je la livre.'))
      .toBeVisible();
    await expect
      .element(screen.getByRole('link', { name: 'Retour en haut' }))
      .toHaveAttribute('href', '#main');
  });

  it('groups the ways to reach William, the CV included', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    const contact = screen.getByRole('list', { name: 'Contact' });
    expect(
      contact
        .getByRole('link')
        .elements()
        .map((link) => link.textContent),
    ).toEqual([
      'william.stoops@epitech.eu',
      'LinkedIn (nouvel onglet)',
      'Télécharger le CV (PDF, 56 Ko)',
    ]);
    await expect
      .element(contact.getByRole('link', { name: 'Télécharger le CV (PDF, 56 Ko)' }))
      .toHaveAttribute('download');
  });

  it('has no axe violations', async () => {
    const screen = await renderInRouter(<SiteFooter />);

    await expectNoAxeViolations(screen.container);
  });
});
