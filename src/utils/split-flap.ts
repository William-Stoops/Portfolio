// The glyphs of an airport's departures board: each cell turns through a few glyphs before
// it stops on its character. A cell starts from the character it showed before (the
// previous line of the board, if any), turns through glyphs of the same kind (a digit
// before a digit, a capital before a capital), then stops. A cell that keeps its character
// does not move; spaces and punctuation stop at once. Deterministic: the prerendered page
// and the browser flip the same glyphs.

const DIGITS = '0123456789';
// Letters by width in a proportional face: a cell keeps its own letter's width, so the
// glyphs it turns through come from letters about as wide, or they would show clipped.
const LETTER_WIDTHS = [
  { narrow: 'IJ', wide: 'MW', rest: 'ABCDEFGHKLNOPQRSTUVXYZ' },
  { narrow: 'fijlrt', wide: 'mw', rest: 'abcdeghknopqsuvxyz' },
] as const;

const GRAPHEMES = new Intl.Segmenter('fr', { granularity: 'grapheme' });

function poolFor(character: string): string | undefined {
  if (/^\p{Nd}$/u.test(character)) {
    return DIGITS;
  }
  // "É" turns like "E": its base letter, without the accent.
  const base = character.normalize('NFD').charAt(0);
  const widths = LETTER_WIDTHS.find(({ narrow, wide, rest }) =>
    `${narrow}${wide}${rest}`.includes(base),
  );
  if (widths === undefined) {
    return undefined;
  }
  if (widths.narrow.includes(base)) {
    return widths.narrow;
  }
  return widths.wide.includes(base) ? widths.wide : widths.rest;
}

// FNV-1a, then mulberry32: a few glyphs chosen by the cell's key, the same on every render.
function seededRandom(key: string): () => number {
  let state = 2_166_136_261;
  for (const unit of key) {
    state = Math.imul(state ^ (unit.codePointAt(0) ?? 0), 16_777_619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function flapGlyphs(
  character: string,
  { from, flips, key }: { from?: string; flips: number; key: string },
): string[] {
  if (from === character) {
    return [character];
  }
  const start = from === undefined ? [] : [from];
  const pool = poolFor(character);
  if (pool === undefined) {
    return [...start, character];
  }
  const random = seededRandom(key);
  const turns: string[] = [];
  for (let turn = 0; turn < flips; turn += 1) {
    // Never the character itself, never the glyph just shown: every flap changes something.
    const candidates = Array.from(pool).filter(
      (glyph) => glyph !== character && glyph !== (turns.at(-1) ?? from),
    );
    turns.push(candidates[Math.floor(random() * candidates.length)] ?? character);
  }
  return [...start, ...turns, character];
}

export type FlapCell = { key: string; character: string; glyphs: readonly string[] };

// A line of the board: one cell per letter as it is read (graphemes), each starting from the
// character at the same place in the line the board showed before, or blank.
export function flapLine(
  text: string,
  { previous, flips, key }: { previous?: string; flips: number; key: string },
): FlapCell[] {
  const before = previous === undefined ? undefined : graphemesOf(previous);
  return graphemesOf(text).map((character, index) => {
    const cellKey = `${key}:${String(index)}`;
    return {
      key: cellKey,
      character,
      glyphs: flapGlyphs(character, {
        ...(before === undefined ? {} : { from: before[index] ?? ' ' }),
        flips,
        key: cellKey,
      }),
    };
  });
}

function graphemesOf(text: string): string[] {
  return Array.from(GRAPHEMES.segment(text), ({ segment }) => segment);
}
