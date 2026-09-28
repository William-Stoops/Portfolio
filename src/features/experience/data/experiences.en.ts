import { type Experience, type ExperienceLabels } from '@/features/experience/types/experience';

// Translation of experiences.fr.ts (ADR 0026): the same roles, figures and claims, most
// recent first. **Passages** are those the CV sets in bold.
export const EXPERIENCES = [
  {
    id: 'it-finance-prorealtime',
    role: 'Software Engineer',
    company: 'IT-Finance, publisher of ProRealTime',
    companyDescription: 'Financial software publisher, about 70 people.',
    period: { start: '2025-09' },
    stack: ['C++', 'Rust', 'Python'],
    highlights: [
      'I designed and shipped to production, in C++, an implied volatility computation the product did not have, across the OPRA options universe, from studying the models to deployment. **Sole developer on the subject.** Its results now serve **tens of thousands of options traders**.',
      'The computation runs continuously and had drifted to ten hours per cycle. Against the team’s hypothesis, which blamed the algorithm, I proved by measurement that the cost came from the data structure. I redesigned it: **from 10 hours to 5 minutes**, and values up to date in the product again.',
      'I migrated the platform’s financial news service, in place for years, to Rust, and added a cache: **99% lower latency** on most requests. In production, serving **hundreds of thousands of users**. A language learned on the job.',
    ],
  },
  {
    id: 'intm-groupe',
    role: 'Full Stack Engineer',
    company: 'INTM Groupe',
    companyDescription: 'IT services and consulting company.',
    period: { start: '2024', end: '2024' },
    stack: ['NestJS', 'React', 'PostgreSQL'],
    highlights: [
      'I delivered **alone and from scratch** the company’s internal activity management tool: business managers’ KPIs, consultant status tracking (in training, on assignment, at which client). From the PostgreSQL schema to the React screens, NestJS back end included.',
    ],
  },
  {
    id: 'strattt',
    role: 'Full Stack Engineer',
    company: 'Strattt',
    period: { start: '2023-09', end: '2024-02' },
    highlights: ['I automated an accounting pipeline end to end.'],
  },
  {
    id: 'gds-elec',
    role: 'Full Stack Engineer',
    company: 'GDS Élec',
    period: { start: '2022-07', end: '2023-01' },
    highlights: [
      'I shipped an application to production that manages electric vehicle charging stations remotely, over the **OCPP protocol**.',
    ],
  },
] as const satisfies readonly Experience[];

export const EXPERIENCE_LABELS = {
  technologies: 'Technologies used',
} as const satisfies ExperienceLabels;
