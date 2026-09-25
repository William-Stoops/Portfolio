import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { EducationOverview } from '@/features/education/components/education-overview';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderOverview() {
  return render(<EducationOverview entries={EDUCATION_ENTRIES} />);
}

describe('EducationOverview', () => {
  it('titles the block with a level-3 heading and each entry with a level-4 heading', async () => {
    const screen = await renderOverview();

    await expect
      .element(screen.getByRole('heading', { level: 3, name: 'Formation' }))
      .toBeVisible();
    expect(
      screen
        .getByRole('heading', { level: 4 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual(['Epitech', 'Korea University (Séoul)', 'Langues']);
  });

  it('marks the English degree name and formats the period', async () => {
    const screen = await renderOverview();

    await expect.element(screen.getByText('Master of Science')).toHaveAttribute('lang', 'en');
    await expect.element(screen.getByText('2021 – 2026')).toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await renderOverview();

    await expectNoAxeViolations(screen.container);
  });
});
