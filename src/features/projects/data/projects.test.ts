import { describe, expect, it } from 'vitest';

import { PROJECTS } from '@/features/projects/data/projects';

// Expected values are copied from docs/content/cv-source.md ("Projets").
describe('projects', () => {
  it('presents STAXX as in the CV', () => {
    const [staxx] = PROJECTS;

    expect(staxx.name).toBe('STAXX');
    expect(staxx.tagline).toBe('Plateforme de commande de matériel pour le BTP');
    expect(staxx.period).toEqual({ start: '2024' });
    expect(staxx.context).toBe(
      'Projet de fin d’études Epitech. **1er au concours Epitech Summit**, pitché devant 300 personnes.',
    );
    expect(staxx.stack).toEqual(['NestJS', 'PostgreSQL', 'React']);
  });

  it('quotes the STAXX highlights word for word', () => {
    expect(PROJECTS[0].highlights).toEqual([
      'J’ai porté le projet et **dirigé les deux autres développeurs** : découpage des sujets, arbitrages d’architecture, cohérence technique jusqu’à la livraison. J’ai réalisé l’intégralité du back-end.',
      'J’ai conçu le moteur de correspondance entre le langage des équipes de chantier et le catalogue : « 20 colliers Atlas pour du tube de 26 » retrouve la bonne référence malgré les fautes, via un dictionnaire d’alias que chaque correction utilisateur enrichit.',
    ]);
  });

  it('points to the pitch video at 1:02:21', () => {
    expect(PROJECTS[0].video).toEqual({
      youtubeId: 'K_TsQ0Itoek',
      startSeconds: 3741,
      title: 'Pitch de STAXX au concours Epitech Summit',
    });
  });
});
