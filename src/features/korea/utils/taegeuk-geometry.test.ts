import { describe, expect, it } from 'vitest';

import { TAEGEUK_ROTATION, TRIGRAMS } from '@/features/korea/utils/taegeuk-geometry';

describe('taegeuk geometry', () => {
  it('draws each trigram with its whole and broken bars', () => {
    expect(TRIGRAMS.map(({ name, path }) => ({ name, path }))).toEqual([
      { name: 'geon', path: 'M-6-3H6M-6 0H6M-6 3H6' },
      { name: 'gam', path: 'M-6-3H-0.5M0.5-3H6M-6 0H6M-6 3H-0.5M0.5 3H6' },
      { name: 'ri', path: 'M-6-3H6M-6 0H-0.5M0.5 0H6M-6 3H6' },
      { name: 'gon', path: 'M-6-3H-0.5M0.5-3H6M-6 0H-0.5M0.5 0H6M-6 3H-0.5M0.5 3H6' },
    ]);
  });

  it('sets geon top left, gam top right, ri bottom left and gon bottom right, on the diagonals', () => {
    expect(TRIGRAMS.map(({ name, left, top, rotate }) => ({ name, left, top, rotate }))).toEqual([
      { name: 'geon', left: '16.243%', top: '16.243%', rotate: '-56.310deg' },
      { name: 'gam', left: '67.090%', top: '16.243%', rotate: '-123.690deg' },
      { name: 'ri', left: '16.243%', top: '67.090%', rotate: '-123.690deg' },
      { name: 'gon', left: '67.090%', top: '67.090%', rotate: '-56.310deg' },
    ]);
  });

  it('brings each trigram in from its own corner', () => {
    expect(TRIGRAMS.map(({ from }) => from)).toEqual([
      '-200% -200%',
      '200% -200%',
      '-200% 200%',
      '200% 200%',
    ]);
  });

  it('tilts the taegeuk along the first diagonal, red above and blue below', () => {
    expect(TAEGEUK_ROTATION).toBe('rotate(-56.310)');
  });
});
