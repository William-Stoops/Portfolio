import { type SkillGroup } from '@/features/skills/types/skill-group';

// Source: docs/content/cv-source.md, "Compétences techniques" (wording and order).
export const SKILL_GROUPS = [
  { id: 'langages', name: 'Langages', skills: ['TypeScript', 'Python', 'C++', 'Rust', 'SQL'] },
  {
    id: 'plateforme',
    name: 'Frameworks et outils',
    skills: ['NestJS', 'Node.js', 'React', 'PostgreSQL', 'Prisma', 'Drizzle', 'Docker', 'CI/CD'],
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
] as const satisfies readonly SkillGroup[];
