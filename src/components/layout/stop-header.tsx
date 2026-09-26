import { Fragment } from 'react';

import { cn } from '@/lib/cn';
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
  // On the flight path (the journey): a marker on the rail, a branch out to the stop, and
  // the overline shown beside the rail on large screens. Off it, a chapter opener only.
  onPath?: boolean;
};

// The header of every chapter of the page, and of every stop of the journey: the title
// rising letter by letter over its filigree (motion.css). On the flight path it adds a
// marker on the rail that fills as the plane reaches it and a branch drawn out to the stop
// (stop-*). Marker and branch sit on
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
  onPath = false,
}: StopHeaderProps) {
  // Three steps, so the outline reads at a glance: a section, a stop of the journey, a
  // chapter of a section.
  const headingClassName = cn(
    'font-semibold tracking-tight text-balance',
    level === 2 && 'text-[clamp(2.75rem,1.5rem+4.5vw,5.5rem)] leading-none',
    level === 3 && size === 'large' && 'text-h1',
    level === 3 && size === 'medium' && 'text-h2',
  );
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
      {onPath ? (
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
        </>
      ) : null}
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
            className={cn(
              onPath && 'chapter-heading',
              'reveal-slide text-small font-semibold tracking-[0.2em] text-accent-fg uppercase tabular-nums',
            )}
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
