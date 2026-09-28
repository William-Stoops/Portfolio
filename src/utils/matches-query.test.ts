import { describe, expect, it } from 'vitest';

import { matchesQuery } from '@/utils/matches-query';

describe('matchesQuery', () => {
  it('finds a text by the start of any of its words, whatever the case and the accents', () => {
    expect(matchesQuery('Compétences', 'comp')).toBe(true);
    expect(matchesQuery('Compétences', 'COMPETENCES')).toBe(true);
    expect(matchesQuery('Mentions légales', 'leg')).toBe(true);
    expect(matchesQuery('Compétences', 'petences')).toBe(false);
  });

  it('needs every word of the query, in any order', () => {
    expect(matchesQuery('Thème sombre', 'sombre theme')).toBe(true);
    expect(matchesQuery('Thème sombre', 'theme clair')).toBe(false);
  });

  it('splits words on punctuation, as a reader would', () => {
    expect(matchesQuery('Télécharger le CV (PDF, 56 Ko)', 'pdf')).toBe(true);
    expect(matchesQuery('Écrire un e-mail', 'mail')).toBe(true);
  });

  it('keeps everything for an empty query', () => {
    expect(matchesQuery('Parcours', '')).toBe(true);
    expect(matchesQuery('Parcours', '   ')).toBe(true);
  });
});
