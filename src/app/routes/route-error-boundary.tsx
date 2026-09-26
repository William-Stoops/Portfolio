import { Link } from 'react-router';

import { PATHS } from '@/config/paths';
import { formatPageTitle } from '@/utils/format-page-title';

// Replaces the whole layout when rendering fails, so it provides its own <main>. The
// technical error is logged by React, never shown to visitors.
export function RouteErrorBoundary() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center gap-4 px-gutter py-section"
    >
      <title>{formatPageTitle('Erreur')}</title>
      <h1 className="text-h1 font-semibold">Une erreur est survenue</h1>
      <p className="text-lead text-fg-muted">
        Cette page n&apos;a pas pu s&apos;afficher. Vous pouvez revenir à l&apos;accueil.
      </p>
      <p>
        <Link to={PATHS.home} className="inline-flex min-h-6 items-center">
          Retour à l’accueil
        </Link>
      </p>
    </main>
  );
}
