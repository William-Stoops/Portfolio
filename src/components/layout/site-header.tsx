import { Link } from 'react-router';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { PATHS } from '@/config/paths';
import { SITE_OWNER } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-gutter py-4">
      <Link
        to={PATHS.home}
        className="inline-flex min-h-11 items-center font-display text-h3 font-semibold text-fg no-underline"
      >
        {SITE_OWNER}
      </Link>
      <ThemeToggle />
    </header>
  );
}
