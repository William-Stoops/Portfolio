import { describe, expect, it } from 'vitest';

import { flapLine } from '@/utils/split-flap';

// The glyphs one cell turns through: a line of one character.
function flapGlyphs(
  character: string,
  { from, flips, key }: { from?: string; flips: number; key: string },
): readonly string[] {
  return (
    flapLine(character, { ...(from === undefined ? {} : { previous: from }), flips, key })[0]
      ?.glyphs ?? []
  );
}

describe('flapGlyphs', () => {
  it('turns a digit through other digits before stopping on it', () => {
    const glyphs = flapGlyphs('5', { flips: 4, key: 'year:3' });

    expect(glyphs).toHaveLength(5);
    expect(glyphs.at(-1)).toBe('5');
    expect(glyphs.every((glyph) => /^\d$/.test(glyph))).toBe(true);
    expect(glyphs.slice(0, -1)).not.toContain('5');
  });

  it('keeps the kind of the character: capitals before a capital, small letters before a small one', () => {
    expect(flapGlyphs('R', { flips: 3, key: 'a' }).every((glyph) => /^[A-Z]$/.test(glyph))).toBe(
      true,
    );
    expect(flapGlyphs('r', { flips: 3, key: 'b' }).every((glyph) => /^[a-z]$/.test(glyph))).toBe(
      true,
    );
  });

  it('turns a narrow letter through narrow ones, a wide one through wide ones', () => {
    // In a proportional face each cell keeps its letter's width: a wide glyph turning in a
    // narrow cell would show clipped.
    expect(flapGlyphs('i', { flips: 4, key: 'n' }).every((glyph) => 'fijlrt'.includes(glyph))).toBe(
      true,
    );
    expect(flapGlyphs('m', { flips: 4, key: 'w' }).every((glyph) => 'mw'.includes(glyph))).toBe(
      true,
    );
    expect(flapGlyphs('W', { flips: 4, key: 'W' }).every((glyph) => 'MW'.includes(glyph))).toBe(
      true,
    );
    expect(
      flapGlyphs('e', { flips: 4, key: 'e' }).some((glyph) => 'fijlrtmw'.includes(glyph)),
    ).toBe(false);
  });

  it('settles accented letters after plain letters of their case', () => {
    const glyphs = flapGlyphs('É', { flips: 3, key: 'c' });

    expect(glyphs.at(-1)).toBe('É');
    expect(glyphs.slice(0, -1).every((glyph) => /^[A-Z]$/.test(glyph))).toBe(true);
  });

  it('starts from the character the cell showed before', () => {
    const glyphs = flapGlyphs('5', { from: '4', flips: 3, key: 'd' });

    expect(glyphs[0]).toBe('4');
    expect(glyphs.at(-1)).toBe('5');
    expect(glyphs).toHaveLength(5);
  });

  it('leaves a cell that keeps its character alone', () => {
    expect(flapGlyphs('2', { from: '2', flips: 4, key: 'e' })).toEqual(['2']);
  });

  it('stops at once on a space or a punctuation mark', () => {
    expect(flapGlyphs(',', { flips: 4, key: 'f' })).toEqual([',']);
    expect(flapGlyphs(' ', { from: 'a', flips: 4, key: 'g' })).toEqual(['a', ' ']);
  });

  it('flips the same glyphs on every render, and other glyphs for another cell', () => {
    expect(flapGlyphs('7', { flips: 6, key: 'h' })).toEqual(
      flapGlyphs('7', { flips: 6, key: 'h' }),
    );
    expect(flapGlyphs('7', { flips: 6, key: 'h' })).not.toEqual(
      flapGlyphs('7', { flips: 6, key: 'i' }),
    );
  });
});

describe('flapLine', () => {
  it('gives each character of a line its cell, from the line the board showed before', () => {
    const cells = flapLine('2025', { previous: '2024', flips: 3, key: 'rail' });

    expect(cells.map(({ character }) => character).join('')).toBe('2025');
    // Only the last digit changes: the others stay put.
    expect(cells.slice(0, 3).map(({ glyphs }) => glyphs)).toEqual([['2'], ['0'], ['2']]);
    expect(cells[3]?.glyphs[0]).toBe('4');
    expect(cells[3]?.glyphs.at(-1)).toBe('5');
  });

  it('starts blank where the previous line was shorter', () => {
    const cells = flapLine('2021', { previous: '02', flips: 2, key: 'rail' });

    expect(cells[2]?.glyphs[0]).toBe(' ');
    expect(cells[3]?.glyphs[0]).toBe(' ');
  });

  it('keeps accented letters whole, as they are read', () => {
    const cells = flapLine('Épé', { flips: 1, key: 'word' });

    expect(cells.map(({ character }) => character)).toEqual(['É', 'p', 'é']);
    expect(new Set(cells.map(({ key }) => key)).size).toBe(3);
  });
});
