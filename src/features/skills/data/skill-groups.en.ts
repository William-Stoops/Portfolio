import { type SkillGroup } from '@/features/skills/types/skill-group';

// Translation of skill-groups.fr.ts (ADR 0026): the same skills, in the same order. The
// ids are shared: they name headings, not text.
export const SKILL_GROUPS = [
  {
    id: 'langages',
    name: 'Programming languages',
    skills: ['TypeScript', 'Python', 'C++', 'Rust'],
  },
  {
    id: 'plateforme',
    name: 'Frameworks and tools',
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
