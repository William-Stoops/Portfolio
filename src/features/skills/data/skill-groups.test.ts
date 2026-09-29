import { describe, expect, it } from 'vitest';

import { SKILL_GROUPS as SKILL_GROUPS_EN } from '@/features/skills/data/skill-groups.en';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups.fr';

// Expected values are copied from docs/content/cv-source.md ("Compétences techniques"),
// with the changes William asked for on 2026-09-28.
describe('skill groups', () => {
  it('lists the two groups the site shows, as William trimmed them, in order', () => {
    expect(SKILL_GROUPS).toEqual([
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
    ]);
  });

  it('translates the skills without adding or dropping one', () => {
    expect(SKILL_GROUPS_EN.map(({ id, skills }) => ({ id, count: skills.length }))).toEqual(
      SKILL_GROUPS.map(({ id, skills }) => ({ id, count: skills.length })),
    );
    expect(SKILL_GROUPS_EN.map(({ name }) => name)).toEqual([
      'Programming languages',
      'Frameworks and tools',
    ]);
  });
});
