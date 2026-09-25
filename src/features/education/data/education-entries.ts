import { type EducationEntry } from '@/features/education/types/education-entry';

// Source: docs/content/cv-source.md, "Formation".
export const EDUCATION_ENTRIES = [
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
] as const satisfies readonly EducationEntry[];
