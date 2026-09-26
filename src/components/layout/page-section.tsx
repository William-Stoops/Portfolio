import { Fragment, type ReactNode } from 'react';

import { formatSectionNumber } from '@/utils/section-number';
import { splitIntoLetters } from '@/utils/split-text';

type PageSectionProps = {
  // Fragment id of the section (see SECTION_IDS); the heading id derives from it.
  id: string;
  title: string;
  // Optional introduction, kept close to the heading.
  lead?: ReactNode;
  children: ReactNode;
};

// Every home page section: a region named by its h2, reachable by its anchor, on the
// shared content column and vertical rhythm. The number and its rule are decoration; the
// title's letters rise one after the other as it scrolls in (motion.css).
export function PageSection({ id, title, lead, children }: PageSectionProps) {
  const headingId = `${id}-titre`;
  const sectionNumber = formatSectionNumber(id);

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-gutter py-section defer-render"
    >
      <div className="flex flex-col gap-5">
        {sectionNumber === undefined ? null : (
          <div
            aria-hidden="true"
            className="flex items-center gap-4 font-display font-semibold text-accent-fg tabular-nums"
          >
            <span>{sectionNumber}</span>
            <span className="h-0.5 w-16 reveal-grow-x bg-accent" />
          </div>
        )}
        <h2 id={headingId} className="text-h1 font-semibold tracking-tight">
          {/* Read as one title; its letters rise one by one as it scrolls in, for the eyes. */}
          <span className="sr-only">{title}</span>
          <span aria-hidden="true">
            {splitIntoLetters(title).map(({ text, index, letters }) => (
              <Fragment key={`${text}-${String(index)}`}>
                {index > 0 ? ' ' : null}
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
        </h2>
        {lead}
      </div>
      {children}
    </section>
  );
}
