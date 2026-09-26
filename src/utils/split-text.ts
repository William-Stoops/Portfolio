type TextPiece = { text: string; index: number };

type WordWithLetters = TextPiece & { letters: readonly TextPiece[] };

// Letters are graphemes, not UTF-16 units: "é" typed as e + combining accent stays one
// letter. Only ASCII spaces separate words, so French non-breaking spaces ("10 h") keep
// their word together, as they do on screen.
const GRAPHEME_SEGMENTER = new Intl.Segmenter('fr', { granularity: 'grapheme' });

function splitIntoWords(text: string): readonly TextPiece[] {
  return text
    .split(' ')
    .filter((word) => word !== '')
    .map((word, index) => ({ text: word, index }));
}

// Letter indexes run across the whole text, so a stagger flows from the first letter of
// the first word to the last letter of the last one.
export function splitIntoLetters(text: string): readonly WordWithLetters[] {
  let letterIndex = 0;
  return splitIntoWords(text).map(({ text: wordText, index }) => ({
    text: wordText,
    index,
    letters: Array.from(GRAPHEME_SEGMENTER.segment(wordText), ({ segment }) => ({
      text: segment,
      index: letterIndex++,
    })),
  }));
}
