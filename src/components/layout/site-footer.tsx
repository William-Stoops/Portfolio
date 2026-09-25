import { ExternalLink } from 'lucide-react';

import { CONTACT_EMAIL, LINKEDIN_URL } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-gutter text-small text-fg-muted">
      {/* The rule sits inside the gutter so it lines up with the content column. */}
      <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border py-8">
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
    </footer>
  );
}
