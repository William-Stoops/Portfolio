import { ArrowUp, Download, ExternalLink } from 'lucide-react';
import { Fragment } from 'react';
import { NavLink } from 'react-router';

import { FOOTER_LINKS } from '@/config/navigation';
import {
  CONTACT_EMAIL,
  CV_FILE,
  LINKEDIN_URL,
  SITE_OWNER,
  SITE_ROLE,
  SITE_TAGLINE,
} from '@/config/site';
import { splitIntoLetters } from '@/utils/split-text';

const OVERLINE_CLASS_NAME = 'text-small font-semibold tracking-[0.2em] text-fg-subtle uppercase';

// Footer links: plain text that takes the accent and grows a hairline underline on hover,
// like the main navigation. They sit in lists, apart from prose, so colour is not their
// only cue.
const LINK_CLASS_NAME =
  'group relative inline-flex min-h-11 items-center gap-2 text-fg-muted no-underline transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-250 after:ease-out hover:text-fg hover:after:scale-x-100 aria-[current=page]:text-fg';

const ICON_CLASS_NAME = 'size-4 shrink-0';

// The page's last word, in the site's own vocabulary of hairlines and restraint: the name
// with its accent dot and the profile sentence, the ways to reach William and the site's
// pages, a thin bar with the way back to the top, and the name again as a one-pixel
// outline across the width, like the lines of the hero surface, rising as the page ends.
export function SiteFooter() {
  return (
    <footer className="@container mx-auto w-full max-w-6xl px-gutter">
      {/* The rule sits inside the gutter so it lines up with the content column. */}
      <div className="grid gap-10 border-t border-border py-12 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-x-20">
        <div className="flex reveal-slide flex-col gap-3">
          <p className="font-display text-h3 font-semibold">
            {SITE_OWNER}
            {/* The accent dot of the hero's greeting, drawn round. */}
            <span
              aria-hidden="true"
              className="ms-0.5 inline-block size-[0.22em] rounded-full bg-accent"
            />
          </p>
          <p className="max-w-xs text-small text-fg-muted">{SITE_TAGLINE}</p>
        </div>
        <div style={{ '--i': 1 }} className="flex reveal-slide flex-col gap-2">
          <p id="pied-de-page-contact" className={OVERLINE_CLASS_NAME}>
            Contact
          </p>
          <ul aria-labelledby="pied-de-page-contact">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS_NAME}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS_NAME}
              >
                LinkedIn
                <span className="sr-only"> (nouvel onglet)</span>
                <ExternalLink
                  aria-hidden="true"
                  focusable="false"
                  className={ICON_CLASS_NAME}
                  strokeWidth={1.75}
                />
              </a>
            </li>
            <li>
              <a href={CV_FILE.href} download className={LINK_CLASS_NAME}>
                <span className="whitespace-nowrap">
                  Télécharger le CV{' '}
                  <span className="text-fg-subtle">({CV_FILE.formatAndWeight})</span>
                </span>
                <Download
                  aria-hidden="true"
                  focusable="false"
                  className={ICON_CLASS_NAME}
                  strokeWidth={1.75}
                />
              </a>
            </li>
          </ul>
        </div>
        <nav
          aria-label="Pied de page"
          style={{ '--i': 2 }}
          className="flex reveal-slide flex-col gap-2"
        >
          <p aria-hidden="true" className={OVERLINE_CLASS_NAME}>
            Le site
          </p>
          <ul>
            {FOOTER_LINKS.map(({ label, path }) => (
              <li key={path}>
                {/* NavLink sets aria-current="page" on the link to the page being read. */}
                <NavLink to={path} className={LINK_CLASS_NAME}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-4 text-small text-fg-subtle">
        <p>
          © {SITE_OWNER} <span aria-hidden="true">—</span> <span lang="en">{SITE_ROLE}</span>
        </p>
        <a href="#main" className={`${LINK_CLASS_NAME} text-small`}>
          Retour en haut
          <span
            aria-hidden="true"
            className="inline-grid size-8 place-items-center rounded-full border border-border-input transition-colors duration-250 group-hover:border-accent"
          >
            <ArrowUp
              focusable="false"
              className="size-4 transition-transform duration-250 ease-out group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </span>
        </a>
      </div>
      {/*
        The sign-off in filigree: the name across the whole width, one step above the
        background (an outline would show the variable font's overlapping contours), letters
        rising as the page reaches its end. Decoration, hidden from assistive tech (the name
        is said above).
      */}
      <p
        data-wordmark
        aria-hidden="true"
        className="-mb-[0.2em] overflow-clip pt-2 text-center font-display text-[13.5cqi] leading-none font-semibold tracking-tighter whitespace-nowrap text-surface-raised select-none"
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
