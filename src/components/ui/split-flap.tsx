import { Fragment } from 'react';

import { cn } from '@/lib/cn';
import { type FlapCell, flapLine } from '@/utils/split-flap';
import { splitIntoLetters } from '@/utils/split-text';

type SplitFlapProps = {
  cells: readonly FlapCell[];
  // How the cells turn (motion.css): as a journey stop's title comes up (flap-title), as
  // the rail's board changes line, on its waypoint's timeline (flap-board), or on their own
  // as the page opens (flap-enter).
  motion: 'flap-title' | 'flap-board' | 'flap-enter';
  // Where this run of cells starts in the stagger of its line (a word of a title).
  firstIndex?: number;
  // Each cell on its own tile, split by its hinge, as on an airport's board.
  tiles?: boolean;
};

// An airport's departures board, for the eyes only: each cell turns through its glyphs
// (utils/split-flap.ts) and stops on its character, one glyph per step. At rest, or still,
// it shows its character, and it always takes that character's width: the glyphs it turns
// through are clipped to it. The parent says the text to assistive tech.
export function SplitFlap({ cells, motion, firstIndex = 0, tiles = false }: SplitFlapProps) {
  return (
    <span aria-hidden="true">
      {cells.map(({ key, character, glyphs }, position) => (
        <span
          key={key}
          className={cn(
            'relative inline-block overflow-clip',
            tiles &&
              'mx-[0.04em] rounded-sm bg-surface-raised px-[0.06em] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-canvas',
          )}
        >
          <span data-flap-character className="invisible whitespace-pre">
            {character}
          </span>
          <span
            style={{ '--steps': glyphs.length - 1, '--i': firstIndex + position }}
            className={cn('absolute inset-x-0 top-0 text-center whitespace-pre', motion)}
          >
            {glyphs.join('\n')}
          </span>
        </span>
      ))}
    </span>
  );
}

// A title on the board, as the journey's stops show theirs: word by word, so lines wrap
// between words, the cells turning in one after the other across the whole title.
export function SplitFlapTitle({ title }: { title: string }) {
  return (
    <span aria-hidden="true">
      {splitIntoLetters(title).map(({ text, index: wordIndex, letters }) => (
        <Fragment key={`${text}-${String(wordIndex)}`}>
          {wordIndex > 0 ? ' ' : null}
          <span className="inline-block whitespace-nowrap">
            <SplitFlap
              cells={flapLine(text, { flips: 3, key: `${title}:${String(wordIndex)}` })}
              motion="flap-title"
              firstIndex={letters[0]?.index ?? 0}
            />
          </span>
        </Fragment>
      ))}
    </span>
  );
}
