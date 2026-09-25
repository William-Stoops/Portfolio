import { Link } from 'react-router';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NAV_ITEMS } from '@/config/navigation';
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
      <div className="ms-auto flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-center gap-x-6">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center font-semibold text-fg no-underline hover:text-accent-fg"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
