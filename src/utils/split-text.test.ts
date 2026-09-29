import { describe, expect, it } from 'vitest';

import { splitIntoLetters, splitIntoWords } from '@/utils/split-text';

describe('splitIntoLetters', () => {
  it('numbers letters across words, so a stagger runs through the whole line', () => {
    expect(splitIntoLetters('Wi St')).toEqual([
      {
        text: 'Wi',
        index: 0,
        letters: [
          { text: 'W', index: 0 },
          { text: 'i', index: 1 },
        ],
      },
      {
        text: 'St',
        index: 1,
        letters: [
          { text: 'S', index: 2 },
          { text: 't', index: 3 },
        ],
      },
    ]);
  });

  it('splits words on spaces only, keeping a non-breaking space inside its word', () => {
    expect(splitIntoLetters('Je la  10\u00A0h').map(({ text }) => text)).toEqual([
      'Je',
      'la',
      '10\u00A0h',
    ]);
  });

  it('never cuts an accented letter in two', () => {
    expect(
      splitIntoLetters('Été')
        .at(0)
        ?.letters.map(({ text }) => text),
    ).toEqual(['É', 't', 'é']);
  });
});

describe('splitIntoWords', () => {
  it('numbers the words, skipping repeated spaces and keeping non-breaking ones inside', () => {
    expect(splitIntoWords('Je  la 10\u00A0h')).toEqual([
      { text: 'Je', index: 0 },
      { text: 'la', index: 1 },
      { text: '10\u00A0h', index: 2 },
    ]);
  });
});
