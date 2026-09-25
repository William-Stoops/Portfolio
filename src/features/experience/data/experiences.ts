import { type Experience } from '@/features/experience/types/experience';

// Source: docs/content/cv-source.md, "Expérience professionnelle", most recent first.
// **Passages** are those the CV sets in bold.
export const EXPERIENCES = [
  {
    id: 'it-finance-prorealtime',
    role: 'Software Engineer',
    company: 'IT-Finance, éditeur de ProRealTime',
    companyDescription: 'Éditeur de logiciel financier, environ 70 personnes.',
    period: { start: '2025-09' },
    stack: ['C++', 'Rust', 'Python'],
    highlights: [
      'J’ai conçu et mis en production, en C++, un calcul de volatilité implicite qui n’existait pas dans le produit, sur l’univers d’options OPRA, de l’étude des modèles au déploiement. **Seul développeur sur le sujet.** Ses résultats servent aujourd’hui **des dizaines de milliers de traders sur options**.',
      'Ce calcul tourne en continu et avait décroché à dix heures par cycle. Contre l’hypothèse de l’équipe, qui visait l’algorithme, j’ai démontré par la mesure que le coût venait de la structure de données. Je l’ai refondue : **de 10 heures à 5 minutes**, et des valeurs de nouveau à jour dans le produit.',
      'J’ai migré en Rust le service d’actualités financières de la plateforme, en place depuis des années, et j’y ai ajouté un cache : **99 % de latence en moins** sur la majorité des requêtes. En production, devant **des centaines de milliers d’utilisateurs**. Langage appris sur le poste.',
    ],
  },
  {
    id: 'intm-groupe',
    role: 'Full Stack Engineer',
    company: 'INTM Groupe',
    companyDescription: 'Entreprise de services du numérique (ESN).',
    period: { start: '2024', end: '2024' },
    stack: ['NestJS', 'React', 'PostgreSQL'],
    highlights: [
      'J’ai livré **seul et from scratch** l’outil interne de pilotage d’activité de l’entreprise : KPI des business managers, suivi du statut des consultants (en formation, en mission, chez quel client). Du schéma PostgreSQL aux écrans React, back NestJS compris.',
    ],
  },
  {
    id: 'strattt-gds-elec',
    role: 'Full Stack Engineer',
    company: 'Strattt, puis GDS Élec',
    period: { start: '2022', end: '2024' },
    highlights: [
      'J’ai automatisé une chaîne comptable de bout en bout, et livré trois applications mobiles en production.',
    ],
  },
] as const satisfies readonly Experience[];
