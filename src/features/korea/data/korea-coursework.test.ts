import { describe, expect, it } from 'vitest';

import { KOREA_CONTENT as KOREA_CONTENT_EN } from '@/features/korea/data/korea-content.en';
import { KOREA_CONTENT } from '@/features/korea/data/korea-content.fr';

// From William, 2026-09-28: linear algebra, forward and backward propagation computed step
// by step, supervised and reinforcement learning, MLP, RNN, LSTM, Transformers (see
// docs/content/cv-source.md). The textbook is Gilbert Strang's.
describe('what the year in South Korea taught', () => {
  const { coursework } = KOREA_CONTENT;

  it('starts from the mathematics: linear algebra, on Gilbert Strang’s textbook', () => {
    expect(coursework.mathematics.course).toBe('Algèbre linéaire');
    expect(coursework.mathematics.source).toBe(
      'Sur le manuel de Gilbert Strang, Introduction to Linear Algebra',
    );
    expect(coursework.mathematics.topics).toEqual([
      'Matrices et factorisations',
      'Espaces vectoriels',
      'Orthogonalité et moindres carrés',
      'Valeurs propres',
      'SVD',
      'Rétropropagation et descente de gradient stochastique',
    ]);
  });

  it('says how networks learn: propagation computed step by step, supervised and by reward', () => {
    expect(coursework.learning.topics.map(({ name }) => name)).toEqual([
      'Propagation avant et rétropropagation',
      'Apprentissage supervisé',
      'Apprentissage par renforcement',
    ]);
  });

  it('traces the architectures from the perceptron to the Transformer', () => {
    expect(coursework.architectures.lineage.map(({ name }) => name)).toEqual([
      'MLP',
      'CNN',
      'RNN',
      'LSTM',
      'Transformer',
    ]);
  });

  it('translates it without adding a subject', () => {
    const english = KOREA_CONTENT_EN.coursework;
    expect(english.mathematics.topics).toHaveLength(coursework.mathematics.topics.length);
    expect(english.learning.topics).toHaveLength(coursework.learning.topics.length);
    expect(english.architectures.lineage.map(({ name }) => name)).toEqual(
      coursework.architectures.lineage.map(({ name }) => name),
    );
  });
});
