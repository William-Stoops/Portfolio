import { Fragment } from 'react';

import { splitIntoLetters } from '@/utils/split-text';

type StopHeaderProps = {
  // A section of the page (2), or a stop within one (3).
  level: 2 | 3;
  headingId?: string;
  title: string;
  // Above the title: the section's number, or the stop's year.
  overline?: string;
  // A section's number is decoration; a stop's year is said.
  isOverlineDecoration?: boolean;
  // Set large behind the title.
  filigree?: string;
  size?: 'large' | 'medium';
};

// The header of every stop along the flight path, sections and years alike: a marker on
// the rail that fills as the plane reaches it, a branch drawn out to the stop, the title
// rising letter by letter over its filigree (motion.css, stop-*). Marker and branch sit on
// the rail, placed from the path's variables (--rail-x, --content-x, and --stop-inset for
// a stop nested in a section's content); the parent holds the stop's timeline (--timeline)
// and is positioned. The overline is shown large beside the rail on large screens, where
// it is visually hidden here.
export function StopHeader({
  level,
  headingId,
  title,
  overline,
  isOverlineDecoration = false,
  filigree,
  size = 'large',
}: StopHeaderProps) {
  const headingClassName = `font-semibold tracking-tight ${size === 'large' ? 'text-h1' : 'text-h2'}`;
  // Read as one title; its letters rise one by one for the eyes only.
  const heading = (
    <>
      <span className="sr-only">{title}</span>
      <span aria-hidden="true">
        {splitIntoLetters(title).map(({ text, index: wordIndex, letters }) => (
          <Fragment key={`${text}-${String(wordIndex)}`}>
            {wordIndex > 0 ? ' ' : null}
            <span className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]">
              {letters.map((letter) => (
                <span
                  key={letter.index}
                  style={{ '--i': letter.index }}
                  className="inline-block reveal-letter"
                >
                  {letter.text}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );

  return (
    <>
      <span
        data-stop-marker
        aria-hidden="true"
        className="absolute start-[calc(var(--rail-x,0.5rem)-0.5rem-var(--stop-inset,0rem))] top-3 size-4 rounded-full border-2 border-accent bg-canvas"
      >
        <span className="absolute inset-0.5 stop-reached rounded-full bg-accent" />
      </span>
      <span
        aria-hidden="true"
        className="absolute start-[calc(var(--rail-x,0.5rem)+0.5rem-var(--stop-inset,0rem))] top-[1.1875rem] hidden h-px w-[calc(var(--content-x,2.5rem)-var(--rail-x,0.5rem)-0.5rem)] stop-branch bg-accent md:block"
      />
      <header className="relative flex flex-col gap-3">
        {filigree === undefined ? null : (
          // A picture of the word, drawn by CSS (a pseudo-element): not text of the page.
          <span
            data-filigree={filigree}
            aria-hidden="true"
            className="absolute end-0 -top-10 -z-10 year-drift font-display text-[clamp(5rem,2rem+10vw,11rem)] leading-none font-bold text-surface-raised tabular-nums select-none before:content-[attr(data-filigree)]"
          />
        )}
        {overline === undefined ? null : (
          <p
            aria-hidden={isOverlineDecoration ? 'true' : undefined}
            className="chapter-heading reveal-slide text-small font-semibold tracking-[0.2em] text-accent-fg uppercase tabular-nums"
          >
            {overline}
          </p>
        )}
        {level === 2 ? (
          <h2 id={headingId} className={headingClassName}>
            {heading}
          </h2>
        ) : (
          <h3 id={headingId} className={headingClassName}>
            {heading}
          </h3>
        )}
      </header>
    </>
  );
}
