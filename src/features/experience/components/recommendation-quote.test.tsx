import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { RecommendationQuote } from '@/features/experience/components/recommendation-quote';
import { INTM_RECOMMENDATION as INTM_RECOMMENDATION_EN } from '@/features/experience/data/recommendation.en';
import { INTM_RECOMMENDATION } from '@/features/experience/data/recommendation.fr';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('RecommendationQuote', () => {
  it('quotes the recommendation as a quotation, a paragraph each', async () => {
    const screen = await render(<RecommendationQuote recommendation={INTM_RECOMMENDATION} />);

    const quote = screen.container.querySelector('blockquote');
    expect([...(quote?.querySelectorAll('p') ?? [])].map((p) => p.textContent)).toEqual(
      INTM_RECOMMENDATION.paragraphs,
    );
  });

  it('signs it under the quote: the author, who he is to William, and where it was written', async () => {
    const screen = await render(<RecommendationQuote recommendation={INTM_RECOMMENDATION} />);

    const figure = screen.getByRole('figure', { name: /^Paul Plancq/ });
    await expect.element(figure).toBeVisible();
    await expect
      .element(
        figure.getByText('Senior Consultant Craft chez HoppR, mentor de William chez INTM Groupe'),
      )
      .toBeVisible();
    await expect.element(figure.getByText('Recommandation LinkedIn, 27 juin 2025')).toBeVisible();
  });

  it('says it is a translation on the English page', async () => {
    const screen = await render(<RecommendationQuote recommendation={INTM_RECOMMENDATION_EN} />);

    await expect
      .element(screen.getByText('LinkedIn recommendation, 27 June 2025 · Translated from French'))
      .toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await render(<RecommendationQuote recommendation={INTM_RECOMMENDATION} />);

    await expectNoAxeViolations(screen.container);
  });
});
