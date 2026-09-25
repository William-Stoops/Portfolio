import { Link } from 'react-router';

import { PATHS } from '@/config/paths';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

export function NotFoundRoute() {
  const headingRef = usePageHeading();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-4 px-gutter py-section">
      <title>{formatPageTitle('Page introuvable')}</title>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-h1 font-semibold focus-visible:outline-hidden"
      >
        Page introuvable
      </h1>
      <p className="text-lead text-fg-muted">
        L&apos;adresse demandée ne correspond à aucune page de ce site.
      </p>
      <p>
        <Link to={PATHS.home} className="inline-flex min-h-6 items-center">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
