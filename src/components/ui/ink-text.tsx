import { Fragment } from 'react';

import { splitIntoWords } from '@/utils/split-text';

type InkTextProps = {
  text: string;
  // statement: set large in the display face (a profile, a stop's note).
  // body: at reading size (a practice's text).
  size?: 'statement' | 'body';
};

const SIZE_CLASS_NAMES: Readonly<Record<NonNullable<InkTextProps['size']>, string>> = {
  statement: 'font-display text-h3 font-medium text-fg',
  body: 'text-lead text-fg-muted',
};

// A paragraph written as it is read: each word lies under a veil of the page's colour that
// lifts, word after word, while the paragraph crosses the screen (motion.css, ink-timeline
// and reveal-ink). The text stays whole and at full contrast underneath; without
// scroll-driven animations there is no veil at all.
export function InkText({ text, size = 'statement' }: InkTextProps) {
  const words = splitIntoWords(text);

  return (
    <p
      style={{ '--n': words.length }}
      className={`max-w-3xl ink-timeline ${SIZE_CLASS_NAMES[size]}`}
    >
      {words.map(({ text: word, index }) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          <span data-word style={{ '--i': index }} className="reveal-ink">
            {word}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
