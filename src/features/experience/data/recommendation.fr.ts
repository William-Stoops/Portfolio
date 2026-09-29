import { type Recommendation } from '@/features/experience/types/recommendation';

// Paul Plancq's LinkedIn recommendation, given by William on 2026-09-28 (see
// docs/content/cv-source.md): word for word, apostrophes set typographically.
export const INTM_RECOMMENDATION = {
  paragraphs: [
    'Je suis heureux de recommander William Stoops, qui a effectué un stage au sein du Groupe INTM. J’ai eu le plaisir de travailler avec lui sur des missions de développement React, et bien que j’aie officiellement eu un rôle de mentor, il était clair dès le début que William possédait déjà un solide bagage technique et une grande autonomie.',
    'William s’est démarqué par sa curiosité et sa volonté d’apprendre. Il a abordé chaque défi avec enthousiasme et a toujours cherché à approfondir ses connaissances et compétences. Son autonomie et sa motivation étaient évidentes, rendant notre collaboration à la fois productive et enrichissante.',
    'Je suis convaincu que William continuera à exceller dans sa carrière et je le recommande vivement à toute équipe à la recherche d’un développeur talentueux et motivé. Son dynamisme et sa soif d’apprendre sont des atouts majeurs pour n’importe quel projet.',
  ],
  author: 'Paul Plancq',
  authorRole: 'Senior Consultant Craft chez HoppR',
  relationship: 'mentor de William chez INTM Groupe',
  source: 'Recommandation LinkedIn, 27 juin 2025',
} as const satisfies Recommendation;
