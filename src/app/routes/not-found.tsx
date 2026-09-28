import { Link } from 'react-router';

import { PageMetadata } from '@/components/layout/page-metadata';
import { PAGE_PATHS } from '@/config/paths';
import { usePageHeading } from '@/hooks/use-page-heading';
import { useLocale, useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { formatPageTitle } from '@/utils/format-page-title';

const NOT_FOUND_MESSAGES: Localized<{ title: string; message: string; backHome: string }> = {
  fr: {
    title: 'Page introuvable',
    message: 'L’adresse demandée ne correspond à aucune page de ce site.',
    backHome: 'Retour à l’accueil',
  },
  en: {
    title: 'Page not found',
    message: 'The address you asked for matches no page on this site.',
    backHome: 'Back to the home page',
  },
};

export function NotFoundRoute() {
  const headingRef = usePageHeading();
  const locale = useLocale();
  const messages = useLocalized(NOT_FOUND_MESSAGES);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-4 px-gutter py-section">
      <PageMetadata title={formatPageTitle(messages.title)} />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-h1 font-semibold focus-visible:outline-hidden"
      >
        {messages.title}
      </h1>
      <p className="text-lead text-fg-muted">{messages.message}</p>
      <p>
        <Link to={PAGE_PATHS[locale].home} className="inline-flex min-h-6 items-center">
          {messages.backHome}
        </Link>
      </p>
    </div>
  );
}
