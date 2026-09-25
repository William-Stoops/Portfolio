import { type SkillGroup } from '@/features/skills/types/skill-group';

// Source: docs/content/cv-source.md, "Compétences techniques" (wording and order).
export const SKILL_GROUPS = [
  { name: 'Langages', skills: ['TypeScript', 'Python', 'C++', 'Rust', 'SQL'] },
  {
    name: 'Plateforme',
    skills: ['NestJS', 'Node.js', 'React', 'PostgreSQL', 'Prisma', 'Drizzle', 'Docker', 'CI/CD'],
  },
  {
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
] as const satisfies readonly SkillGroup[];
