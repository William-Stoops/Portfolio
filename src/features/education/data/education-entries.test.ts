import { describe, expect, it } from 'vitest';

import { EDUCATION_ENTRIES as EDUCATION_ENTRIES_EN } from '@/features/education/data/education-entries.en';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries.fr';

// Expected values are copied from docs/content/cv-source.md ("Formation").
describe('education entries', () => {
  it('lists Epitech, Korea University and English as in the CV', () => {
    expect(EDUCATION_ENTRIES).toEqual([
      {
        id: 'epitech',
        title: 'Epitech',
        degree: 'Master of Science',
        description: 'Expert en Technologies de l’Information',
        period: { start: '2021', end: '2026' },
      },
      {
        id: 'korea-university',
        title: 'Korea University (Séoul)',
        description: 'Année suivie en anglais, deep learning et computer vision.',
      },
      {
        id: 'langues',
        title: 'Langues',
        description: 'Anglais professionnel, TOEIC 820.',
      },
    ]);
  });

  it('translates the entries, keeping the degree, the period and the TOEIC score', () => {
    expect(EDUCATION_ENTRIES_EN.map(({ id }) => id)).toEqual(EDUCATION_ENTRIES.map(({ id }) => id));
    expect(EDUCATION_ENTRIES_EN[0]).toMatchObject({
      degree: 'Master of Science',
      period: { start: '2021', end: '2026' },
    });
    expect(EDUCATION_ENTRIES_EN[2].description).toBe('Professional English, TOEIC 820.');
  });
});
