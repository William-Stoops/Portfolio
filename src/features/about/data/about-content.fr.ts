import { SECTION_IDS } from '@/config/paths';
import { type AboutContent } from '@/features/about/types/about-content';

// Source: docs/content/cv-source.md (Profil, Expérience, Projets).
export const ABOUT_CONTENT = {
  id: SECTION_IDS.fr.about,
  title: 'À propos',
  profile:
    'Software Engineer, 3 ans d’expérience en entreprise. Je décide d’une architecture, je la mesure, je la livre. Je viens du calcul et de la performance, je construis des produits full stack en TypeScript, et je travaille tous les jours avec des agents et des LLM.',
  axes: [
    {
      title: 'Calcul & performance',
      description:
        'Volatilité implicite en C++ sur l’univers d’options OPRA, service d’actualités migré en Rust. Les optimisations partent de la mesure.',
    },
    {
      title: 'Produits full stack',
      description:
        'En TypeScript, du schéma PostgreSQL aux écrans React, back-end NestJS compris, livrés seul ou en menant une équipe.',
    },
    {
      title: 'IA, agents & LLM',
      description:
        'Agents de code et serveurs MCP au quotidien, API OpenAI et Anthropic avec function calling et sorties contraintes par schéma, modèles entraînés à Korea University.',
    },
  ],
  labels: { axes: 'Domaines d’expertise' },
} as const satisfies AboutContent;
