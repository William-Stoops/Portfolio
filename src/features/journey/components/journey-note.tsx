import { Fragment } from 'react';

import { splitIntoWords } from '@/utils/split-text';

type JourneyNoteProps = { text: string };

// What happened at a stop, in William's words: inked in word by word as it is read, like
// the profile (motion.css, ink-timeline), the text staying whole and at full contrast
// underneath.
export function JourneyNote({ text }: JourneyNoteProps) {
  const words = splitIntoWords(text);

  return (
    <p
      style={{ '--n': words.length }}
      className="max-w-3xl font-display text-h3 font-medium text-fg ink-timeline"
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
