import { type Period } from '@/types/period';

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
