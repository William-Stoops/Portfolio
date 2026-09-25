import { describe, expect, it } from 'vitest';

import { ABOUT_CONTENT } from '@/features/about/data/about-content';

// Expected values are copied from docs/content/cv-source.md: the CV is the only source.
describe('about content', () => {
  it('uses the profile paragraph of the CV', () => {
    expect(ABOUT_CONTENT.profile).toBe(
      'Software Engineer, 3 ans d’expérience en entreprise. Je décide d’une architecture, je la mesure, je la livre. Je viens du calcul et de la performance, je construis des produits full stack en TypeScript, et je travaille tous les jours avec des agents et des LLM.',
    );
  });

  it('presents the three axes of the profile', () => {
    expect(ABOUT_CONTENT.axes.map(({ title }) => title)).toEqual([
      'Calcul & performance',
      'Produits full stack',
      'IA, agents & LLM',
    ]);
  });

  it('quotes the key figures of the CV exactly, with French typographic spaces', () => {
    expect(ABOUT_CONTENT.metrics.map(({ value }) => value)).toEqual([
      '10 h → 5 min',
      '−99 %',
      '3 ans',
      '1er',
    ]);
  });

  it('gives every figure a label and a spoken form when symbols would be read badly', () => {
    expect(
      ABOUT_CONTENT.metrics.map((metric) =>
        'spokenValue' in metric ? metric.spokenValue : undefined,
      ),
    ).toEqual(['de 10 heures à 5 minutes', 'moins 99 %', undefined, 'premier']);
    for (const { label } of ABOUT_CONTENT.metrics) {
      expect(label.trim()).not.toBe('');
    }
  });
});
