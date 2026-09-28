import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { EducationList } from '@/features/education/components/education-list';
import { EDUCATION_ENTRIES as EDUCATION_ENTRIES_EN } from '@/features/education/data/education-entries.en';
import { EDUCATION_ENTRIES } from '@/features/education/data/education-entries.fr';
import { LocaleContext } from '@/i18n/locale-context';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderList() {
  return render(
    <>
      <h3 id="titre">Formation</h3>
      <EducationList entries={EDUCATION_ENTRIES} labelledBy="titre" />
    </>,
  );
}

describe('EducationList', () => {
  it('lists each entry under a level-4 heading, named by the chapter heading', async () => {
    const screen = await renderList();

    const list = screen.getByRole('list', { name: 'Formation' });
    expect(
      list
        .getByRole('heading', { level: 4 })
        .elements()
        .map((heading) => heading.textContent),
    ).toEqual(['Epitech', 'Korea University (Corée du Sud)', 'Langues']);
  });

  it('marks the English degree name and formats the period', async () => {
    const screen = await renderList();

    await expect.element(screen.getByText('Master of Science')).toHaveAttribute('lang', 'en');
    await expect.element(screen.getByText('2021 – 2026')).toBeVisible();
  });

  it('draws the English entries, with their periods', async () => {
    const screen = await render(
      <LocaleContext value="en">
        <h3 id="title">Education</h3>
        <EducationList entries={EDUCATION_ENTRIES_EN} labelledBy="title" />
      </LocaleContext>,
    );

    const list = screen.getByRole('list', { name: 'Education' });
    await expect
      .element(list.getByRole('heading', { level: 4, name: 'Korea University (South Korea)' }))
      .toBeVisible();
    await expect.element(list.getByText('2021 – 2026')).toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await renderList();

    await expectNoAxeViolations(screen.container);
  });
});
