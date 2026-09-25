import { type Period } from '@/types/period';

export type EducationEntry = {
  id: string;
  title: string;
  // English degree name, rendered with lang="en".
  degree?: string;
  description: string;
  period?: Period;
};
