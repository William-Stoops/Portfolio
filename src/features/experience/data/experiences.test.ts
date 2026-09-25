import { describe, expect, it } from 'vitest';

import { EXPERIENCES } from '@/features/experience/data/experiences';

// Expected values are copied from docs/content/cv-source.md, with French typography
// (apostrophes, non-breaking spaces) and **bold** passages as in the CV.
describe('experiences', () => {
  it('lists the three roles of the CV, most recent first', () => {
    expect(EXPERIENCES.map(({ role, company }) => `${role} — ${company}`)).toEqual([
      'Software Engineer — IT-Finance, éditeur de ProRealTime',
      'Full Stack Engineer — INTM Groupe',
      'Full Stack Engineer — Strattt, puis GDS Élec',
    ]);
  });

  it('keeps the periods of the CV', () => {
    expect(EXPERIENCES.map(({ period }) => period)).toEqual([
      { start: '2025-09' },
      { start: '2024', end: '2024' },
      { start: '2022', end: '2024' },
    ]);
  });

  it('quotes the ProRealTime highlights word for word', () => {
    expect(EXPERIENCES[0].highlights).toEqual([
      'J’ai conçu et mis en production, en C++, un calcul de volatilité implicite qui n’existait pas dans le produit, sur l’univers d’options OPRA, de l’étude des modèles au déploiement. **Seul développeur sur le sujet.** Ses résultats servent aujourd’hui **des dizaines de milliers de traders sur options**.',
      'Ce calcul tourne en continu et avait décroché à dix heures par cycle. Contre l’hypothèse de l’équipe, qui visait l’algorithme, j’ai démontré par la mesure que le coût venait de la structure de données. Je l’ai refondue : **de 10 heures à 5 minutes**, et des valeurs de nouveau à jour dans le produit.',
      'J’ai migré en Rust le service d’actualités financières de la plateforme, en place depuis des années, et j’y ai ajouté un cache : **99 % de latence en moins** sur la majorité des requêtes. En production, devant **des centaines de milliers d’utilisateurs**. Langage appris sur le poste.',
    ]);
  });

  it('quotes the INTM and Strattt highlights word for word', () => {
    expect(EXPERIENCES[1].highlights).toEqual([
      'J’ai livré **seul et from scratch** l’outil interne de pilotage d’activité de l’entreprise : KPI des business managers, suivi du statut des consultants (en formation, en mission, chez quel client). Du schéma PostgreSQL aux écrans React, back NestJS compris.',
    ]);
    expect(EXPERIENCES[2].highlights).toEqual([
      'J’ai automatisé une chaîne comptable de bout en bout, et livré trois applications mobiles en production.',
    ]);
  });

  it('lists a stack only where the CV names one', () => {
    expect(
      EXPERIENCES.map((experience) => ('stack' in experience ? experience.stack : undefined)),
    ).toEqual([['C++', 'Rust', 'Python'], ['NestJS', 'React', 'PostgreSQL'], undefined]);
  });

  it('uses unique, kebab-case ids', () => {
    const ids = EXPERIENCES.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z\d]+(?:-[a-z\d]+)*$/);
    }
  });
});
