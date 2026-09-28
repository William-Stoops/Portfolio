import { describe, expect, it } from 'vitest';

import { HERO_CONTENT as HERO_CONTENT_EN } from '@/features/hero/data/hero-content.en';
import { HERO_CONTENT } from '@/features/hero/data/hero-content.fr';
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

  it('sums up the profile in three highlights, each backed by the CV', () => {
    expect(HERO_CONTENT.highlights).toEqual([
      { value: '1er', label: 'au concours Epitech Summit' },
      { value: 'C++ · Rust · TS', label: 'du calcul au produit' },
      { value: 'Agents & LLM', label: 'au quotidien' },
    ]);
  });

  it('describes the portrait without claiming what the photo does not show', () => {
    expect(HERO_CONTENT.portraitAlt).toBe('William Stoops, souriant, sur scène');
  });

  it('links the calls to action to the French contact section and the CV', () => {
    expect(HERO_CONTENT.contact).toEqual({ label: 'Me contacter', href: '/fr#contact' });
    expect(HERO_CONTENT.cv).toEqual({
      label: 'Télécharger le CV',
      details: 'PDF, 56 Ko',
      href: '/cv/william-stoops-cv-fr.pdf',
    });
  });

  it('translates the hero without changing a fact, and says the CV is in French', () => {
    expect(HERO_CONTENT_EN.technologies).toEqual(HERO_CONTENT.technologies);
    expect(HERO_CONTENT_EN.highlights.map(({ value }) => value)).toEqual([
      '1st',
      'C++ · Rust · TS',
      'Agents & LLMs',
    ]);
    expect(HERO_CONTENT_EN.contact.href).toBe('/en#contact');
    expect(HERO_CONTENT_EN.cv.details).toBe('PDF in French, 56 KB');
  });

  it('declares a square portrait no wider than its 520 px source', () => {
    expect(PORTRAIT_PICTURE.width).toBe(PORTRAIT_PICTURE.height);
    expect(Math.max(...PORTRAIT_PICTURE.widths)).toBeLessThanOrEqual(520);
    expect(PORTRAIT_PICTURE.formats.at(-1)).toBe('jpg');
  });
});
