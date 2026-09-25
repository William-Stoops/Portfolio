import { describe, expect, it } from 'vitest';
import { Link } from 'react-router';

import { usePageHeading } from '@/hooks/use-page-heading';
import { renderRoutes } from '@/testing/render-with-router';

function Page({ title, linkTo }: { title: string; linkTo: string }) {
  const headingRef = usePageHeading();
  return (
    <>
      <h1 ref={headingRef} tabIndex={-1}>
        {title}
      </h1>
      <Link to={linkTo}>Aller ailleurs</Link>
    </>
  );
}

const ROUTES = [
  { path: '/', element: <Page title="Accueil" linkTo="/autre" /> },
  { path: '/autre', element: <Page title="Autre page" linkTo="/#section" /> },
];

describe('usePageHeading', () => {
  it('leaves focus alone on the initial page load', async () => {
    const screen = await renderRoutes(ROUTES);

    await expect.element(screen.getByRole('heading', { name: 'Accueil' })).not.toHaveFocus();
  });

  it('moves focus to the new page heading after a client-side navigation', async () => {
    const screen = await renderRoutes(ROUTES);

    await screen.getByRole('link', { name: 'Aller ailleurs' }).click();

    await expect.element(screen.getByRole('heading', { name: 'Autre page' })).toHaveFocus();
  });

  it('lets an anchor win when the new URL targets a fragment', async () => {
    const screen = await renderRoutes(ROUTES, '/autre');

    await screen.getByRole('link', { name: 'Aller ailleurs' }).click();

    await expect.element(screen.getByRole('heading', { name: 'Accueil' })).not.toHaveFocus();
  });
});
