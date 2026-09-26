import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { SkillList } from '@/features/skills/components/skill-list';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const [LANGUAGES] = SKILL_GROUPS;

async function renderList() {
  return render(
    <>
      <h3 id="titre">Langages</h3>
      <SkillList skills={LANGUAGES.skills} labelledBy="titre" />
    </>,
  );
}

describe('SkillList', () => {
  it('lists the skills of a group, named by its heading', async () => {
    const screen = await renderList();

    const list = screen.getByRole('list', { name: 'Langages' });
    expect(
      list
        .getByRole('listitem')
        .elements()
        .map((item) => item.firstElementChild?.textContent),
    ).toEqual(LANGUAGES.skills);
  });

  it('has no axe violations', async () => {
    const screen = await renderList();

    await expectNoAxeViolations(screen.container);
  });
});
