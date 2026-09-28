import { type EducationEntry } from '@/features/education/types/education-entry';

// Translation of education-entries.fr.ts (ADR 0026): the same entries, nothing added.
export const EDUCATION_ENTRIES = [
  {
    id: 'epitech',
    title: 'Epitech',
    degree: 'Master of Science',
    description: 'Expert in Information Technology',
    period: { start: '2021', end: '2026' },
  },
  {
    id: 'korea-university',
    title: 'Korea University (South Korea)',
    description: 'A year of courses taught in English, deep learning and computer vision.',
  },
  {
    id: 'langues',
    title: 'Languages',
    description: 'Professional English, TOEIC 820.',
  },
] as const satisfies readonly EducationEntry[];
