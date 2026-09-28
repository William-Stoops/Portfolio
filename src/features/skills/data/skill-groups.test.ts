import { describe, expect, it } from 'vitest';

import { SKILL_GROUPS as SKILL_GROUPS_EN } from '@/features/skills/data/skill-groups.en';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups.fr';

// Expected values are copied from docs/content/cv-source.md ("Compétences techniques").
describe('skill groups', () => {
  it('lists the three groups of the CV with their skills, in order', () => {
    expect(SKILL_GROUPS).toEqual([
      { id: 'langages', name: 'Langages', skills: ['TypeScript', 'Python', 'C++', 'Rust', 'SQL'] },
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
          'CI/CD',
        ],
      },
      {
        id: 'ia',
        name: 'IA et data',
        skills: [
          'LLM OpenAI et Anthropic',
          'Function calling',
          'JSON Schema',
          'Agents',
          'MCP',
          'Hugging Face',
          'Apprentissage par transfert',
          'CNN',
          'YOLO',
          'pandas',
          'numpy',
          'scikit-learn',
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
      'AI and data',
    ]);
  });
});
