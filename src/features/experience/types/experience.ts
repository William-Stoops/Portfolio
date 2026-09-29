import { type Period } from '@/types/period';

// Interface text of the experience cards, in the page's language.
export type ExperienceLabels = { technologies: string };

export type Experience = {
  id: string;
  role: string;
  company: string;
  companyDescription?: string;
  period: Period;
  stack?: readonly string[];
  // CV wording; passages the CV sets in bold are wrapped in **double asterisks**.
  highlights: readonly string[];
};
