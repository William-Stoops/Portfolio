import { type ReactNode } from 'react';

import { chapterHeadingId } from '@/utils/chapter-heading-id';
import { formatTwoDigits } from '@/utils/format-two-digits';

type Chapter = { id: string; title: string; content: ReactNode };

type StickyChaptersProps = { chapters: readonly Chapter[] };

// Chapters told one after the other: on large screens a sticky column shows the number
// and title of the chapter being read, crossfading from one to the next as the page
// scrolls, beside a gauge of the progress (scroll-driven CSS, see motion.css). The
// column is a drawing, hidden from assistive tech: each chapter keeps its real heading,
// visually hidden only where the column shows. Without scroll-driven animations or with
// reduced motion, the chapters simply stack with their headings.
export function StickyChapters({ chapters }: StickyChaptersProps) {
  const timelineScope = [
    ...chapters.map((_, index) => `--chapter-${String(index)}`),
    '--chapters',
  ].join(', ');

  return (
    <div style={{ '--scope': timelineScope }} className="chapters-layout">
      <div aria-hidden="true" className="chapter-rail">
        <div className="sticky top-32 flex h-72 gap-6">
          <div className="w-0.5 rounded-full bg-border">
            <div className="size-full chapter-progress rounded-full bg-accent" />
          </div>
          <div className="relative flex-1">
            {chapters.map(({ id, title }, index) => (
              <p
                key={id}
                data-chapter-label
                style={{ '--timeline': `--chapter-${String(index)}` }}
                className="absolute inset-x-0 top-0 flex chapter-label flex-col gap-3"
              >
                <span className="font-display text-h3 font-semibold text-accent-fg tabular-nums">
                  {formatTwoDigits(index + 1)}
                  <span className="text-fg-subtle"> / {formatTwoDigits(chapters.length)}</span>
                </span>
                <span className="font-display text-h1 font-semibold tracking-tight">{title}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div style={{ '--timeline': '--chapters' }} className="flex flex-col gap-20 chapter-timeline">
        {chapters.map(({ id, title, content }, index) => (
          <div
            key={id}
            style={{ '--timeline': `--chapter-${String(index)}` }}
            className="flex flex-col gap-6 chapter-timeline"
          >
            <h3
              id={chapterHeadingId(id)}
              className="chapter-heading font-display text-h2 font-semibold"
            >
              {title}
            </h3>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
