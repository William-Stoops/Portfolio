import { describe, expect, it } from 'vitest';

import { INTM_RECOMMENDATION as INTM_RECOMMENDATION_EN } from '@/features/experience/data/recommendation.en';
import { INTM_RECOMMENDATION } from '@/features/experience/data/recommendation.fr';

// Copied from the LinkedIn recommendation William gave on 2026-09-28 (see
// docs/content/cv-source.md): word for word, typographic apostrophes aside.
describe('the INTM recommendation', () => {
  it('quotes Paul Plancq word for word, in his three paragraphs', () => {
    expect(INTM_RECOMMENDATION.paragraphs).toEqual([
      'Je suis heureux de recommander William Stoops, qui a effectué un stage au sein du Groupe INTM. J’ai eu le plaisir de travailler avec lui sur des missions de développement React, et bien que j’aie officiellement eu un rôle de mentor, il était clair dès le début que William possédait déjà un solide bagage technique et une grande autonomie.',
      'William s’est démarqué par sa curiosité et sa volonté d’apprendre. Il a abordé chaque défi avec enthousiasme et a toujours cherché à approfondir ses connaissances et compétences. Son autonomie et sa motivation étaient évidentes, rendant notre collaboration à la fois productive et enrichissante.',
      'Je suis convaincu que William continuera à exceller dans sa carrière et je le recommande vivement à toute équipe à la recherche d’un développeur talentueux et motivé. Son dynamisme et sa soif d’apprendre sont des atouts majeurs pour n’importe quel projet.',
    ]);
  });

  it('names its author, what he was to William, and where it was written', () => {
    expect(INTM_RECOMMENDATION).toMatchObject({
      author: 'Paul Plancq',
      authorRole: 'Senior Consultant Craft chez HoppR',
      relationship: 'mentor de William chez INTM Groupe',
      source: 'Recommandation LinkedIn, 27 juin 2025',
    });
    expect(INTM_RECOMMENDATION).not.toHaveProperty('translationNote');
  });

  it('says so when it is a translation', () => {
    expect(INTM_RECOMMENDATION_EN.author).toBe('Paul Plancq');
    expect(INTM_RECOMMENDATION_EN.paragraphs).toHaveLength(3);
    expect(INTM_RECOMMENDATION_EN.translationNote).toBe('Translated from French');
  });
});
