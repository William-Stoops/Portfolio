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
  // "du calcul au produit": C++ and Rust for the computing work, TypeScript for the
  // full-stack products, as the CV's three roles show.
  highlights: [
    { value: '1er', label: 'au concours Epitech Summit' },
    { value: 'C++ · Rust · TS', label: 'du calcul au produit' },
    { value: 'Agents & LLM', label: 'au quotidien' },
  ],
  portraitAlt: 'William Stoops, souriant, sur scène',
} as const satisfies HeroContent;
