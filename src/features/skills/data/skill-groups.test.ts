import { describe, expect, it } from 'vitest';

import { SKILL_GROUPS } from '@/features/skills/data/skill-groups';

// Expected values are copied from docs/content/cv-source.md ("Compétences techniques").
describe('skill groups', () => {
  it('lists the three groups of the CV with their skills, in order', () => {
    expect(SKILL_GROUPS).toEqual([
      { id: 'langages', name: 'Langages', skills: ['TypeScript', 'Python', 'C++', 'Rust', 'SQL'] },
      {
        id: 'plateforme',
        name: 'Plateforme',
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
        name: 'IA',
        skills: [
          'LLM OpenAI et Anthropic',
          'function calling',
          'JSON Schema',
          'agents',
          'MCP',
          'Hugging Face',
          'apprentissage par transfert',
          'CNN',
          'YOLO',
          'pandas',
          'numpy',
          'scikit-learn',
        ],
      },
    ]);
  });
});
