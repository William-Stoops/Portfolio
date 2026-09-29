import { describe, expect, it } from 'vitest';

import { ABOUT_CONTENT as ABOUT_CONTENT_EN } from '@/features/about/data/about-content.en';
import { ABOUT_CONTENT } from '@/features/about/data/about-content.fr';

// Expected values are copied from docs/content/cv-source.md: the CV is the only source.
describe('about content', () => {
  it('uses the profile paragraph of the CV', () => {
    expect(ABOUT_CONTENT.profile).toBe(
      'Software Engineer, 3 ans d’expérience en entreprise. Je décide d’une architecture, je la mesure, je la livre. Je viens du calcul et de la performance, je construis des produits full stack en TypeScript, et je travaille tous les jours avec des agents et des LLM.',
    );
  });

  it('presents the three axes of the profile', () => {
    expect(ABOUT_CONTENT.axes.map(({ title }) => title)).toEqual([
      'Calcul & performance',
      'Produits full stack',
      'IA, agents & LLM',
    ]);
  });

  it('translates the axes without adding or dropping one', () => {
    expect(ABOUT_CONTENT_EN.axes).toHaveLength(ABOUT_CONTENT.axes.length);
  });

  it('anchors the section in the language of its page', () => {
    expect(ABOUT_CONTENT.id).toBe('a-propos');
    expect(ABOUT_CONTENT_EN.id).toBe('about');
  });
});
