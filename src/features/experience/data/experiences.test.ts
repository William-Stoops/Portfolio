import { describe, expect, it } from 'vitest';

import { EXPERIENCES as EXPERIENCES_EN } from '@/features/experience/data/experiences.en';
import { EXPERIENCES } from '@/features/experience/data/experiences.fr';
import { type Experience } from '@/features/experience/types/experience';

// What a translation leaves untouched.
function neutralFieldsOf({ id, role, period, stack }: Experience) {
  return { id, role, period, stack };
}

// How many bold markers each highlight holds: a translation keeps every emphasis.
function boldPassages(highlights: readonly string[]): number[] {
  return highlights.map((highlight) => highlight.split('**').length);
}

// Expected values are copied from docs/content/cv-source.md, with French typography
// (apostrophes, non-breaking spaces) and **bold** passages as in the CV.
describe('experiences', () => {
  it('lists the four roles, most recent first', () => {
    expect(EXPERIENCES.map(({ role, company }) => `${role} — ${company}`)).toEqual([
      'Software Engineer — IT-Finance, éditeur de ProRealTime',
      'Full Stack Engineer — INTM Groupe',
      'Full Stack Engineer — Strattt',
      'Full Stack Engineer — GDS Élec',
    ]);
  });

  it('keeps the periods of the CV', () => {
    expect(EXPERIENCES.map(({ period }) => period)).toEqual([
      { start: '2025-09' },
      { start: '2024', end: '2024' },
      { start: '2023-09', end: '2024-02' },
      { start: '2022-07', end: '2023-01' },
    ]);
  });

  it('quotes the ProRealTime highlights word for word', () => {
    expect(EXPERIENCES[0].highlights).toEqual([
      'J’ai conçu et mis en production, en C++, un calcul de volatilité implicite qui n’existait pas dans le produit, sur l’univers d’options OPRA, de l’étude des modèles au déploiement. **Seul développeur sur le sujet.** Ses résultats servent aujourd’hui **des dizaines de milliers de traders sur options**.',
      'Ce calcul tourne en continu et avait décroché à dix heures par cycle. Contre l’hypothèse de l’équipe, qui visait l’algorithme, j’ai démontré par la mesure que le coût venait de la structure de données. Je l’ai refondue : **de 10 heures à 5 minutes**, et des valeurs de nouveau à jour dans le produit.',
      'J’ai migré en Rust le service d’actualités financières de la plateforme, en place depuis des années, et j’y ai ajouté un cache : **99 % de latence en moins** sur la majorité des requêtes. En production, devant **des centaines de milliers d’utilisateurs**. Langage appris sur le poste.',
    ]);
  });

  it('quotes the INTM, Strattt and GDS Élec highlights word for word', () => {
    expect(EXPERIENCES[1].highlights).toEqual([
      'J’ai livré **seul et from scratch** l’outil interne de pilotage d’activité de l’entreprise : KPI des business managers, suivi du statut des consultants (en formation, en mission, chez quel client). Du schéma PostgreSQL aux écrans React, back NestJS compris.',
    ]);
    expect(EXPERIENCES[2].highlights).toEqual([
      'J’ai automatisé une chaîne comptable de bout en bout.',
    ]);
    expect(EXPERIENCES[3].highlights).toEqual([
      'J’ai livré une application en production qui gère à distance des bornes de recharge électriques, via le **protocole OCPP**.',
    ]);
  });

  it('lists a stack only where the CV names one', () => {
    expect(
      EXPERIENCES.map((experience) => ('stack' in experience ? experience.stack : undefined)),
    ).toEqual([['C++', 'Rust', 'Python'], ['NestJS', 'React', 'PostgreSQL'], undefined, undefined]);
  });

  it('uses unique, kebab-case ids', () => {
    const ids = EXPERIENCES.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z\d]+(?:-[a-z\d]+)*$/);
    }
  });

  it('translates the roles without changing a date, a technology or an emphasis', () => {
    expect(EXPERIENCES_EN.map((experience) => neutralFieldsOf(experience))).toEqual(
      EXPERIENCES.map((experience) => neutralFieldsOf(experience)),
    );
    expect(EXPERIENCES_EN.map(({ highlights }) => boldPassages(highlights))).toEqual(
      EXPERIENCES.map(({ highlights }) => boldPassages(highlights)),
    );
  });

  it('keeps the figures of the CV in English', () => {
    const [itFinance] = EXPERIENCES_EN;

    expect(itFinance.highlights.join(' ')).toContain('**from 10 hours to 5 minutes**');
    expect(itFinance.highlights.join(' ')).toContain('**99% lower latency**');
  });
});
