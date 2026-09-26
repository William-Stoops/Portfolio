import { describe, expect, it } from 'vitest';

import { PROJECTS } from '@/features/projects/data/projects';
import {
  NRJ_EXPLANATION_PICTURE,
  NRJ_INTERVIEW_PICTURE,
  SUMMIT_PICTURE,
} from '@/features/projects/data/staxx-pictures';

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

  it('sums up STAXX in three figures drawn from the CV', () => {
    expect(PROJECTS[0].figures).toEqual([
      { value: '1er', label: 'au concours Epitech Summit' },
      { value: '300', label: 'personnes au pitch' },
      { value: '3', label: 'développeurs, dont deux que j’ai dirigés' },
    ]);
  });

  it('shows the Epitech Summit win, described without claiming what the photo does not show', () => {
    expect(PROJECTS[0].photo).toEqual({
      picture: SUMMIT_PICTURE,
      alt: 'William Stoops, le trophée de la première place en main, entouré de six personnes sur la scène de l’Epitech Summit',
      place: 'Epitech Summit',
      caption: 'Sur scène, le trophée en main.',
    });
  });

  it('tells the NRJ Lille radio appearance, with its two photos described', () => {
    expect(PROJECTS[0].press).toEqual({
      label: 'À la radio',
      outlet: 'NRJ Lille',
      summary: 'Nous sommes passés sur NRJ Lille, la radio régionale de NRJ, pour présenter STAXX.',
      photos: [
        {
          picture: NRJ_INTERVIEW_PICTURE,
          alt: 'William Stoops répond aux questions d’un journaliste, un micro NRJ tendu vers lui',
        },
        {
          picture: NRJ_EXPLANATION_PICTURE,
          alt: 'William Stoops explique STAXX face au micro NRJ, une invitation à l’Epitech Summit posée sur la table',
        },
      ],
    });
  });

  it('never declares a photo wider than its source', () => {
    for (const picture of [SUMMIT_PICTURE, NRJ_INTERVIEW_PICTURE, NRJ_EXPLANATION_PICTURE]) {
      expect(Math.max(...picture.widths)).toBeLessThanOrEqual(picture.width);
    }
  });
});
