import { type ReactNode } from 'react';

import { StopHeader } from '@/components/layout/stop-header';
import { formatTwoDigits } from '@/utils/format-two-digits';

type ChapterRow = {
  id: string;
  title: string;
  headingId?: string;
  content: ReactNode;
};

type ChapterRowsProps = { rows: readonly ChapterRow[] };

// The chapters of a section that is not a story (the practices, the skills): one ruled row
// each, its header on the left (number in filigree, title rising, as every chapter of the
// page opens), what it holds on the right, sliding into place as it arrives.
export function ChapterRows({ rows }: ChapterRowsProps) {
  return (
    <ol className="border-b border-border">
      {rows.map(({ id, title, headingId, content }, index) => (
        <li
          key={id}
          className="@container grid gap-8 border-t border-border py-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12"
        >
          <div className="relative isolate">
            <StopHeader
              level={3}
              {...(headingId === undefined ? {} : { headingId })}
              title={title}
              overline={formatTwoDigits(index + 1)}
              isOverlineDecoration
              filigree={formatTwoDigits(index + 1)}
              size="medium"
            />
          </div>
          <div className="reveal-slide md:pt-8">{content}</div>
        </li>
      ))}
    </ol>
  );
}
