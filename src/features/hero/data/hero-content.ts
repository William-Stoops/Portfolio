import { type HeroContent } from '@/features/hero/types/hero-content';

// Source: docs/content/cv-source.md (identity, profile, header keywords).
export const HERO_CONTENT = {
  greeting: 'Bonjour',
  role: 'Software Engineer & AI Engineer',
  tagline: 'Je décide d’une architecture, je la mesure, je la livre.',
  technologies: [
    'TypeScript',
    'Python',
    'C++',
    'Rust',
    'NestJS',
    'React',
    'PostgreSQL',
    'Docker',
    'LLM',
    'Agents',
    'MCP',
  ],
  portraitAlt: 'William Stoops, souriant, sur scène',
} as const satisfies HeroContent;
