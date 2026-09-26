import { ExternalLink } from 'lucide-react';
import { Fragment } from 'react';
import { NavLink } from 'react-router';

import { FOOTER_LINKS } from '@/config/navigation';
import { CONTACT_EMAIL, LINKEDIN_URL, SITE_OWNER } from '@/config/site';
import { splitIntoLetters } from '@/utils/split-text';

export function SiteFooter() {
  return (
    <footer className="@container mx-auto w-full max-w-6xl px-gutter text-small text-fg-muted">
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
      {/*
        The sign-off: the name across the whole width, its letters rising as the page
        reaches its end. Decoration, hidden from assistive tech (the header says the name).
      */}
      <p
        data-wordmark
        aria-hidden="true"
        className="-mb-[0.18em] overflow-clip pt-6 text-center font-display text-[13.5cqi] leading-none font-bold tracking-tighter whitespace-nowrap text-fg select-none"
      >
        {splitIntoLetters(SITE_OWNER).map(({ text, index, letters }) => (
          <Fragment key={text}>
            {index > 0 ? ' ' : null}
            {letters.map((letter) => (
              <span
                key={letter.index}
                style={{ '--i': letter.index }}
                className="inline-block reveal-letter"
              >
                {letter.text}
              </span>
            ))}
          </Fragment>
        ))}
      </p>
    </footer>
  );
}
