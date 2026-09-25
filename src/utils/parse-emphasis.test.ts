import { describe, expect, it } from 'vitest';

import { parseEmphasis } from '@/utils/parse-emphasis';

describe('parseEmphasis', () => {
  it('returns plain text as a single segment', () => {
    expect(parseEmphasis('Langage appris sur le poste.')).toEqual([
      { text: 'Langage appris sur le poste.', isEmphasized: false },
    ]);
  });

  it('splits **marked** passages into emphasized segments', () => {
    expect(parseEmphasis('de **10 heures à 5 minutes**, et des valeurs à jour')).toEqual([
      { text: 'de ', isEmphasized: false },
      { text: '10 heures à 5 minutes', isEmphasized: true },
      { text: ', et des valeurs à jour', isEmphasized: false },
    ]);
  });

  it('handles several emphasized passages and one at the start', () => {
    expect(parseEmphasis('**Seul** sur le sujet, devant **des milliers**')).toEqual([
      { text: 'Seul', isEmphasized: true },
      { text: ' sur le sujet, devant ', isEmphasized: false },
      { text: 'des milliers', isEmphasized: true },
    ]);
  });

  it('rejects an unbalanced marker instead of rendering stray asterisks', () => {
    expect(() => parseEmphasis('texte **non fermé')).toThrow(/Unbalanced/);
  });
});
