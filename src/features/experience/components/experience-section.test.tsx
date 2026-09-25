import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ExperienceCard } from '@/features/experience/components/experience-card';
import { ExperienceSection } from '@/features/experience/components/experience-section';
import { EXPERIENCES } from '@/features/experience/data/experiences';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderSection() {
  return render(<ExperienceSection experiences={EXPERIENCES} />);
}

describe('ExperienceSection', () => {
  it('is a region named by its heading and reachable by the #parcours anchor', async () => {
    const screen = await renderSection();

    const region = screen.getByRole('region', { name: 'Parcours' });
    await expect.element(region).toHaveAttribute('id', 'parcours');
  });

  it('orders the roles in an ordered list, each titled with role and company', async () => {
    const screen = await renderSection();

    const headings = screen.getByRole('heading', { level: 3 }).elements();
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Software Engineer, IT-Finance, éditeur de ProRealTime',
      'Full Stack Engineer, INTM Groupe',
      'Full Stack Engineer, Strattt, puis GDS Élec',
    ]);
    expect(screen.container.querySelector('ol')?.children).toHaveLength(3);
  });

  it('marks the English job titles', async () => {
    const screen = await renderSection();

    await expect.element(screen.getByText('Software Engineer')).toHaveAttribute('lang', 'en');
  });

  it('shows each period', async () => {
    const screen = await renderSection();

    await expect.element(screen.getByText('Depuis sept. 2025')).toBeVisible();
    await expect.element(screen.getByText('2022 – 2024')).toBeVisible();
  });

  it('emphasises the passages the CV sets in bold, without leaking the markers', async () => {
    const screen = await renderSection();

    const strongTexts = [...screen.container.querySelectorAll('strong')].map(
      (strong) => strong.textContent,
    );
    expect(strongTexts).toContain('de 10 heures à 5 minutes');
    expect(screen.container.textContent).not.toContain('**');
  });

  it('lists the technologies only for roles where the CV names them', async () => {
    const screen = await renderSection();

    expect(screen.getByRole('list', { name: 'Technologies utilisées' }).elements()).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    const screen = await renderSection();

    await expectNoAxeViolations(screen.container);
  });
});

describe('ExperienceCard layout', () => {
  // The card adapts to its own width (container query), not to the viewport.
  it.each([
    { width: 360, direction: 'column' },
    { width: 800, direction: 'row' },
  ])(
    'lays its header out as a $direction in a $width px container',
    async ({ width, direction }) => {
      const [experience] = EXPERIENCES;
      const screen = await render(
        <div className="@container" style={{ width }}>
          <ExperienceCard experience={experience} />
        </div>,
      );

      const header = screen.container.querySelector('article header');
      expect(header).not.toBeNull();
      expect(header === null ? '' : getComputedStyle(header).flexDirection).toBe(direction);
    },
  );
});
