import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { SkillsOverview } from '@/features/skills/components/skills-overview';
import { SKILL_GROUPS } from '@/features/skills/data/skill-groups';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderOverview() {
  return render(<SkillsOverview groups={SKILL_GROUPS} />);
}

describe('SkillsOverview', () => {
  it('titles the block with a level-3 heading', async () => {
    const screen = await renderOverview();

    await expect
      .element(screen.getByRole('heading', { level: 3, name: 'Compétences techniques' }))
      .toBeVisible();
  });

  it('pairs each group name with its skills in a description list', async () => {
    const screen = await renderOverview();

    const terms = [...screen.container.querySelectorAll('dt')].map((term) => term.textContent);
    expect(terms).toEqual(['Langages', 'Plateforme', 'IA']);
    const skillCounts = [...screen.container.querySelectorAll('dd')].map(
      (definition) => definition.querySelectorAll('li').length,
    );
    expect(skillCounts).toEqual(SKILL_GROUPS.map(({ skills }) => skills.length));
  });

  it('has no axe violations', async () => {
    const screen = await renderOverview();

    await expectNoAxeViolations(screen.container);
  });
});
