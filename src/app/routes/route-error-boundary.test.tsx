import { describe, expect, it, vi } from 'vitest';

import { RouteErrorBoundary } from '@/app/routes/route-error-boundary';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderRoutes } from '@/testing/render-with-router';

function BrokenPage(): never {
  throw new Error('Rendering failed');
}

const BROKEN_ROUTES = [{ path: '/', Component: BrokenPage, ErrorBoundary: RouteErrorBoundary }];

describe('RouteErrorBoundary', () => {
  it('replaces a crashed page with an accessible error page', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const screen = await renderRoutes(BROKEN_ROUTES);

    await expect.element(screen.getByRole('main')).toBeVisible();
    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Une erreur est survenue' }))
      .toBeVisible();
    await expect
      .element(screen.getByRole('link', { name: 'Retour à l’accueil' }))
      .toHaveAttribute('href', '/fr');
    await expect.poll(() => document.title).toBe('Erreur – William Stoops');
  });

  it('apologizes in English on an English page, and leads to the English home', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const screen = await renderRoutes(BROKEN_ROUTES, { locale: 'en' });

    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Something went wrong' }))
      .toBeVisible();
    await expect
      .element(screen.getByRole('link', { name: 'Back to the home page' }))
      .toHaveAttribute('href', '/en');
  });

  it('does not leak the technical error message to visitors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const screen = await renderRoutes(BROKEN_ROUTES);

    await expect.element(screen.getByText('Rendering failed')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const screen = await renderRoutes(BROKEN_ROUTES);
    await expect.element(screen.getByRole('heading', { level: 1 })).toBeVisible();

    await expectNoAxeViolations(screen.container);
  });
});
