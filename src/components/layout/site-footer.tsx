import { ExternalLink } from 'lucide-react';
import { NavLink } from 'react-router';

import { FOOTER_LINKS } from '@/config/navigation';
import { CONTACT_EMAIL, LINKEDIN_URL } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-gutter text-small text-fg-muted">
      {/* The rule sits inside the gutter so it lines up with the content column. */}
      <div className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:flex-wrap sm:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-6 items-center">
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-6 items-center gap-1"
            >
              LinkedIn
              <span className="sr-only"> (nouvel onglet)</span>
              <ExternalLink
                aria-hidden="true"
                focusable="false"
                className="size-4"
                strokeWidth={1.75}
              />
            </a>
          </li>
        </ul>
        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ label, path }) => (
              <li key={path}>
                {/* NavLink sets aria-current="page" on the link to the page being read. */}
                <NavLink
                  to={path}
                  className="inline-flex min-h-6 items-center aria-[current=page]:font-semibold"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
