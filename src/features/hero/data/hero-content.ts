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
  stickers: [
    '1er au concours Epitech Summit',
    'C++ · Rust · TypeScript',
    'Agents & LLM au quotidien',
  ],
  portraitAlt: 'William Stoops, souriant, sur scène',
} as const satisfies HeroContent;
