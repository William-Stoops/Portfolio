import { type AboutContent } from '@/features/about/types/about-content';

// Source: docs/content/cv-source.md (Profil, Expérience, Projets, "Chiffres clés").
export const ABOUT_CONTENT = {
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
  metrics: [
    {
      value: '10 h → 5 min',
      spokenValue: 'de 10 heures à 5 minutes',
      label: 'Cycle de calcul de volatilité implicite, après refonte de la structure de données',
    },
    {
      value: '−99 %',
      spokenValue: 'moins 99 %',
      label: 'De latence sur la majorité des requêtes du service d’actualités migré en Rust',
    },
    { value: '3 ans', label: 'D’expérience en entreprise' },
    {
      value: '1er',
      spokenValue: 'premier',
      label: 'Au concours Epitech Summit avec STAXX, pitché devant 300 personnes',
    },
  ],
} as const satisfies AboutContent;
