import { Quote } from 'lucide-react';
import { useId } from 'react';

import { type Recommendation } from '@/features/experience/types/recommendation';

type RecommendationQuoteProps = { recommendation: Recommendation };

// Someone who worked with William, in their own words, under the role they shared: a
// quotation, signed under it, where and when it was written, and whether it is translated.
export function RecommendationQuote({ recommendation }: RecommendationQuoteProps) {
  const authorId = useId();
  const { paragraphs, author, authorRole, relationship, source, translationNote } = recommendation;

  return (
    <figure
      aria-labelledby={authorId}
      className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 @xl:p-8"
    >
      <Quote
        aria-hidden="true"
        focusable="false"
        className="size-8 text-accent-fg"
        strokeWidth={1.5}
      />
      <blockquote className="flex flex-col gap-4 text-lead text-fg">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </blockquote>
      <figcaption className="flex flex-col gap-1 border-t border-border pt-5">
        <span id={authorId} className="font-semibold">
          {author}
        </span>
        <span className="text-small text-fg-muted">
          {authorRole}, {relationship}
        </span>
        <span className="text-small text-fg-subtle">
          {translationNote === undefined ? source : `${source} · ${translationNote}`}
        </span>
      </figcaption>
    </figure>
  );
}
