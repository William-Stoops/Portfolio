import { describe, expect, it } from 'vitest';

import { HERO_CONTENT } from '@/features/hero/data/hero-content';
import { PORTRAIT_PICTURE } from '@/features/hero/data/portrait-picture';

// Expected values are copied from docs/content/cv-source.md: the CV is the only source.
describe('hero content', () => {
  it('uses the job title from the CV', () => {
    expect(HERO_CONTENT.role).toBe('Software Engineer & AI Engineer');
  });

  it('uses the profile sentence from the CV', () => {
    expect(HERO_CONTENT.tagline).toBe('Je décide d’une architecture, je la mesure, je la livre.');
  });

  it('lists exactly the header keywords of the CV, in order', () => {
    expect(HERO_CONTENT.technologies).toEqual([
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

  it('writes the portrait stickers with facts from the CV only', () => {
    expect(HERO_CONTENT.stickers).toEqual([
      '1er au concours Epitech Summit',
      'C++ · Rust · TypeScript',
      'Agents & LLM au quotidien',
    ]);
  });

  it('describes the portrait without claiming what the photo does not show', () => {
    expect(HERO_CONTENT.portraitAlt).toBe('William Stoops, souriant, sur scène');
  });

  it('declares a square portrait no wider than its 520 px source', () => {
    expect(PORTRAIT_PICTURE.width).toBe(PORTRAIT_PICTURE.height);
    expect(Math.max(...PORTRAIT_PICTURE.widths)).toBeLessThanOrEqual(520);
    expect(PORTRAIT_PICTURE.formats.at(-1)).toBe('jpg');
  });
});
