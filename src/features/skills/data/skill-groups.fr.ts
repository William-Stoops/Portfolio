import { type SkillGroup } from '@/features/skills/types/skill-group';

// Source: docs/content/cv-source.md, "Compétences techniques" (wording and order), as
// William trimmed it on 2026-09-28: without SQL, with Jenkins, and without the AI and data
// group, a list of names that proved nothing on its own.
export const SKILL_GROUPS = [
  { id: 'langages', name: 'Langages', skills: ['TypeScript', 'Python', 'C++', 'Rust'] },
  {
    id: 'plateforme',
    name: 'Frameworks et outils',
    skills: [
      'NestJS',
      'Node.js',
      'React',
      'PostgreSQL',
      'Prisma',
      'Drizzle',
      'Docker',
      'Jenkins',
      'CI/CD',
    ],
  },
] as const satisfies readonly SkillGroup[];
