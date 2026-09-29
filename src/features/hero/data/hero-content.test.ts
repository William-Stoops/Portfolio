import { describe, expect, it } from 'vitest';

import { SITE_TAGLINE } from '@/config/site';
import { HERO_CONTENT as HERO_CONTENT_EN } from '@/features/hero/data/hero-content.en';
import { HERO_CONTENT } from '@/features/hero/data/hero-content.fr';
import { PORTRAIT_PICTURE } from '@/features/hero/data/portrait-picture';

// Expected values are copied from docs/content/cv-source.md: the CV is the only source.
describe('hero content', () => {
  it('opens on the profile sentence of the CV, then the rest of the profile', () => {
    expect(HERO_CONTENT.headline).toBe(SITE_TAGLINE.fr);
    expect(HERO_CONTENT.lead).toBe(
      'Je viens du calcul et de la performance, je construis des produits full stack en TypeScript, et je travaille tous les jours avec des agents et des LLM.',
    );
  });

  it('names the job title and the city above it', () => {
    expect(HERO_CONTENT.eyebrow).toBe('Software Engineer & AI Engineer · Paris');
  });

  it('points to the IT-Finance rework with its figure', () => {
    expect(HERO_CONTENT.proof).toEqual({
      context: 'IT-Finance · calcul de volatilité implicite',
      before: '10 h',
      after: '5 min',
      link: 'Voir le calcul',
    });
  });

  it('lists the keywords of the CV header, in its order', () => {
    expect(HERO_CONTENT.keywords).toEqual([
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
    ]);
  });

  it('describes the portrait without claiming what the photo does not show', () => {
    expect(HERO_CONTENT.portraitAlt).toBe(
      'Portrait de William Stoops, en veste sombre, dans la lumière du soleil',
    );
  });

  it('translates the hero without changing a fact', () => {
    expect(HERO_CONTENT_EN.headline).toBe(SITE_TAGLINE.en);
    expect(HERO_CONTENT_EN.lead).toBe(
      'I come from computing and performance, I build full stack products in TypeScript, and I work with agents and LLMs every day.',
    );
    expect(HERO_CONTENT_EN.eyebrow).toBe('Software Engineer & AI Engineer · Paris');
    expect(HERO_CONTENT_EN.proof).toEqual({
      context: 'IT-Finance · implied volatility computation',
      before: '10 h',
      after: '5 min',
      link: 'See the computation',
    });
    expect(HERO_CONTENT_EN.keywords).toEqual(HERO_CONTENT.keywords);
    expect(HERO_CONTENT_EN.portraitAlt).toBe(
      'Portrait of William Stoops in a dark jacket, in the sunlight',
    );
  });

  it('serves the square photo no wider than its 1254 px source, with a JPEG fallback', () => {
    expect(PORTRAIT_PICTURE.width).toBe(PORTRAIT_PICTURE.height);
    expect(Math.max(...PORTRAIT_PICTURE.widths)).toBeLessThanOrEqual(1254);
    expect(PORTRAIT_PICTURE.formats.at(-1)).toBe('jpg');
  });
});
