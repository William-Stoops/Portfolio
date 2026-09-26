import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { AiPracticeSection } from '@/features/ai-practice/components/ai-practice-section';
import { AI_PRACTICE_CONTENT } from '@/features/ai-practice/data/ai-practice-content';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderSection() {
  return render(<AiPracticeSection content={AI_PRACTICE_CONTENT} />);
}

describe('AiPracticeSection', () => {
  it('is a region named by the CV section title and reachable by the #ia anchor', async () => {
    const screen = await renderSection();

    await expect
      .element(screen.getByRole('region', { name: AI_PRACTICE_CONTENT.title }))
      .toHaveAttribute('id', 'ia');
  });

  it('gives each practice a level-3 heading and its CV text', async () => {
    const screen = await renderSection();

    expect(
      screen
        .getByRole('heading', { level: 3 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual(AI_PRACTICE_CONTENT.items.map(({ title }) => title));
    await expect
      .element(screen.getByText(/Pennylane, outils Google, Context7, 21st.dev/))
      .toBeVisible();
  });

  it('numbers the items as decoration, hidden from assistive tech', async () => {
    const screen = await render(<AiPracticeSection content={AI_PRACTICE_CONTENT} />);

    const numbers = [...screen.container.querySelectorAll('[data-item-number]')];
    expect(numbers.map((number) => number.textContent)).toEqual(['01', '02', '03']);
    for (const number of numbers) {
      expect(number.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('has no axe violations', async () => {
    const screen = await renderSection();

    await expectNoAxeViolations(screen.container);
  });
});
