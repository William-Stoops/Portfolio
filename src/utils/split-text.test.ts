import { describe, expect, it } from 'vitest';

import { splitIntoLetters, splitIntoWords } from '@/utils/split-text';

describe('splitIntoWords', () => {
  it('keeps each word with its position, dropping the spaces', () => {
    expect(splitIntoWords('Je la  mesure')).toEqual([
      { text: 'Je', index: 0 },
      { text: 'la', index: 1 },
      { text: 'mesure', index: 2 },
    ]);
  });

  it('keeps a non-breaking space inside its word', () => {
    expect(splitIntoWords('10 h → 5 min').map(({ text }) => text)).toEqual(['10 h', '→', '5 min']);
  });
});

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

  it('never cuts an accented letter in two', () => {
    expect(
      splitIntoLetters('Été')
        .at(0)
        ?.letters.map(({ text }) => text),
    ).toEqual(['É', 't', 'é']);
  });
});
