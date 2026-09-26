import { describe, expect, it } from 'vitest';

import { KOREA_CONTENT } from '@/features/korea/data/korea-content';
import {
  BASEBALL_STADIUM_PICTURE,
  HANOK_CAFE_PICTURE,
  NIGHT_PAVILION_PICTURE,
} from '@/features/korea/data/korea-pictures';

// Facts are copied from docs/content/cv-source.md ("IA", "Formation"); the photos and the
// Korean words were provided or asked for by William.
describe('Korea content', () => {
  it('opens on a greeting and the year in Seoul, as in the CV', () => {
    expect(KOREA_CONTENT.greeting).toEqual({ korean: '안녕하세요', french: 'bonjour' });
    expect(KOREA_CONTENT.lead).toBe(
      'Une année à Séoul, à Korea University, suivie en anglais : deep learning et computer vision.',
    );
  });

  it('names the university in Korean and sums the year up in three figures', () => {
    expect(KOREA_CONTENT.university).toEqual({ korean: '고려대학교', name: 'Korea University' });
    expect(KOREA_CONTENT.figures).toEqual([
      { value: '61e', label: 'université mondiale, classement QS' },
      { value: '1 an', label: 'suivi en anglais' },
      { value: '3', label: 'modèles entraînés' },
    ]);
  });

  it('lists the three models trained there, as in the CV', () => {
    expect(KOREA_CONTENT.models).toEqual([
      { name: 'BERT affiné', detail: 'Classification de texte, avec Hugging Face.' },
      { name: 'CNN', detail: 'L’état d’une partie d’échecs, reconnu sur l’image du plateau.' },
      { name: 'Détecteur de gestes', detail: 'En temps réel, de type YOLO, sur flux webcam.' },
    ]);
  });

  it('comes home saying goodbye in Korean, and hello in French as the site does', () => {
    expect(KOREA_CONTENT.homecoming).toEqual({
      farewell: { korean: '안녕히 계세요', french: 'au revoir' },
      greeting: 'Bonjour.',
    });
  });

  it('flies from France to Seoul', () => {
    expect(KOREA_CONTENT.route).toEqual({
      origin: { name: 'France' },
      destination: { name: 'Séoul', korean: '서울' },
    });
  });

  it('shows the three photos, each described and captioned in Korean and French', () => {
    expect(KOREA_CONTENT.photos).toEqual([
      {
        picture: BASEBALL_STADIUM_PICTURE,
        alt: 'William Stoops, de dos, en blouson de Korea University, agite un drapeau dans les tribunes d’un stade de baseball de Séoul',
        korean: '야구장',
        caption: 'Au stade, aux couleurs de Korea University.',
      },
      {
        picture: HANOK_CAFE_PICTURE,
        alt: 'Un ordinateur portable ouvert sur du code, dans un café aux poutres de bois traditionnelles, face aux montagnes',
        korean: '카페',
        caption: 'Du code, face aux montagnes.',
      },
      {
        picture: NIGHT_PAVILION_PICTURE,
        alt: 'Un pavillon traditionnel coréen illuminé se reflète dans un étang, de nuit',
        korean: '밤',
        caption: 'Un pavillon qui se reflète dans l’eau, la nuit.',
      },
    ]);
  });

  it('never declares a photo wider than its source', () => {
    for (const { picture } of KOREA_CONTENT.photos) {
      expect(Math.max(...picture.widths)).toBeLessThanOrEqual(picture.width);
    }
  });

  it('says the band in Korean, then in translation', () => {
    expect(KOREA_CONTENT.band).toEqual({
      korean: ['고려대학교', '서울', '딥러닝', '컴퓨터 비전'],
      translation: ['Korea University', 'Séoul', 'Deep learning', 'Computer vision'],
    });
  });
});
