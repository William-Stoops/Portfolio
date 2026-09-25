import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/app/routes';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderRoutes } from '@/testing/render-with-router';

describe('application routes', () => {
  it('renders the page shell landmarks in reading order', async () => {
    const screen = await renderRoutes(ROUTES);

    const landmarks = [
      screen.getByRole('banner').element(),
      screen.getByRole('main').element(),
      screen.getByRole('contentinfo').element(),
    ];
    const [banner, main, footer] = landmarks;
    expect(banner?.compareDocumentPosition(main ?? banner)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(main?.compareDocumentPosition(footer ?? main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('starts with the skip link as the first link of the page', async () => {
    const screen = await renderRoutes(ROUTES);

    await expect
      .element(screen.getByRole('link').first())
      .toHaveAccessibleName('Aller au contenu principal');
  });

  it('renders the home page with its title and heading', async () => {
    const screen = await renderRoutes(ROUTES);

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'William Stoops' }))
      .toBeVisible();
    await expect
      .poll(() => document.title)
      .toBe('William Stoops – Software Engineer & AI Engineer');
  });

  it('renders a not-found page for unknown URLs', async () => {
    const screen = await renderRoutes(ROUTES, '/page-inexistante');

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Page introuvable' }))
      .toBeVisible();
    await expect.poll(() => document.title).toBe('Page introuvable – William Stoops');
  });

  it('brings the visitor back home from the not-found page with focus on the heading', async () => {
    const screen = await renderRoutes(ROUTES, '/page-inexistante');

    await screen.getByRole('link', { name: "Retour à l'accueil" }).click();

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'William Stoops' }))
      .toHaveFocus();
  });

  for (const { path, heading, title } of [
    {
      path: '/accessibilite',
      heading: 'Déclaration d’accessibilité',
      title: 'Déclaration d’accessibilité – William Stoops',
    },
    {
      path: '/mentions-legales',
      heading: 'Mentions légales',
      title: 'Mentions légales – William Stoops',
    },
    { path: '/plan-du-site', heading: 'Plan du site', title: 'Plan du site – William Stoops' },
  ]) {
    it(`renders ${path} with its heading and title`, async () => {
      const screen = await renderRoutes(ROUTES, path);

      await expect.element(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expect.poll(() => document.title).toBe(title);
    });
  }

  for (const path of [
    '/',
    '/page-inexistante',
    '/accessibilite',
    '/mentions-legales',
    '/plan-du-site',
  ]) {
    it(`has no axe violations on ${path}`, async () => {
      const screen = await renderRoutes(ROUTES, path);
      await expect.element(screen.getByRole('heading', { level: 1 })).toBeVisible();

      await expectNoAxeViolations(screen.container);
    });
  }
});
