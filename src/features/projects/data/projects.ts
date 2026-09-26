import { type Project } from '@/features/projects/types/project';

// Source: docs/content/cv-source.md, "Projets".
export const PROJECTS = [
  {
    id: 'staxx',
    name: 'STAXX',
    tagline: 'Plateforme de commande de matériel pour le BTP',
    period: { start: '2024' },
    context:
      'Projet de fin d’études Epitech. **1er au concours Epitech Summit**, pitché devant 300 personnes.',
    stack: ['NestJS', 'PostgreSQL', 'React'],
    // From the context and the first highlight: 300 at the pitch, a team of three.
    figures: [
      { value: '1er', label: 'au concours Epitech Summit' },
      { value: '300', label: 'personnes au pitch' },
      { value: '3', label: 'développeurs, dont deux que j’ai dirigés' },
    ],
    highlights: [
      'J’ai porté le projet et **dirigé les deux autres développeurs** : découpage des sujets, arbitrages d’architecture, cohérence technique jusqu’à la livraison. J’ai réalisé l’intégralité du back-end.',
      'J’ai conçu le moteur de correspondance entre le langage des équipes de chantier et le catalogue : « 20 colliers Atlas pour du tube de 26 » retrouve la bonne référence malgré les fautes, via un dictionnaire d’alias que chaque correction utilisateur enrichit.',
    ],
    video: {
      youtubeId: 'K_TsQ0Itoek',
      startSeconds: 3741,
      title: 'Pitch de STAXX au concours Epitech Summit',
    },
  },
] as const satisfies readonly Project[];
