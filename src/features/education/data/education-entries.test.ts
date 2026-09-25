import { describe, expect, it } from 'vitest';

import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries';

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
});
