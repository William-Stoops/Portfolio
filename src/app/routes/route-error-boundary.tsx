import { Link } from 'react-router';

import { PageMetadata } from '@/components/layout/page-metadata';
import { PAGE_PATHS } from '@/config/paths';
import { useLocale, useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { formatPageTitle } from '@/utils/format-page-title';

type ErrorMessages = { title: string; heading: string; message: string; backHome: string };

// Interface text, not page content: the error page must work whatever failed.
const ERROR_MESSAGES: Localized<ErrorMessages> = {
  fr: {
    title: 'Erreur',
    heading: 'Une erreur est survenue',
    message: 'Cette page n’a pas pu s’afficher. Vous pouvez revenir à l’accueil.',
    backHome: 'Retour à l’accueil',
  },
  en: {
    title: 'Error',
    heading: 'Something went wrong',
    message: 'This page could not be displayed. You can go back to the home page.',
    backHome: 'Back to the home page',
  },
};

// Replaces the whole layout when rendering fails, so it provides its own <main>. The
// technical error is logged by React, never shown to visitors.
export function RouteErrorBoundary() {
  const locale = useLocale();
  const messages = useLocalized(ERROR_MESSAGES);

  return (
    <main
      id="main"
      className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center gap-4 px-gutter py-section"
    >
      <PageMetadata title={formatPageTitle(messages.title)} />
      <h1 className="text-h1 font-semibold">{messages.heading}</h1>
      <p className="text-lead text-fg-muted">{messages.message}</p>
      <p>
        <Link to={PAGE_PATHS[locale].home} className="inline-flex min-h-6 items-center">
          {messages.backHome}
        </Link>
      </p>
    </main>
  );
}
