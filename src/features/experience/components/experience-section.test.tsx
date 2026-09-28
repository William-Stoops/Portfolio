import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { ExperienceCard } from '@/features/experience/components/experience-card';
import { ExperienceSection } from '@/features/experience/components/experience-section';
import { EXPERIENCES } from '@/features/experience/data/experiences';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { formatPeriod } from '@/utils/format-period';

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

  it('gives each role its period, in its card', async () => {
    const screen = await renderSection();

    // Visible on small screens; on large ones read here and shown large beside the rail.
    for (const period of ['Depuis sept. 2025', '2022 – 2024']) {
      expect(
        screen.getByRole('article').getByText(period, { exact: true }).elements(),
      ).toHaveLength(1);
    }
  });

  it('shows the period in the card on small screens', async () => {
    await page.viewport(390, 800);
    const screen = await renderSection();

    await expect
      .element(screen.getByRole('article').first().getByText('Depuis sept. 2025'))
      .toBeVisible();
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

  it('draws a timeline rail with one step per experience, hidden from assistive tech', async () => {
    const screen = await render(<ExperienceSection experiences={EXPERIENCES} />);

    const rail = screen.container.querySelector('[data-rail]');
    expect(rail?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.container.querySelectorAll('[data-rail-step][aria-hidden="true"]')).toHaveLength(
      EXPERIENCES.length,
    );
  });

  it('sets each period large beside its role on large screens, read only once', async () => {
    await page.viewport(1280, 800);
    const screen = await render(<ExperienceSection experiences={EXPERIENCES} />);

    const periods = [...screen.container.querySelectorAll('[data-period-marker]')];
    expect(periods.map((period) => period.textContent)).toEqual(
      EXPERIENCES.map(({ period }) => formatPeriod(period)),
    );
    for (const period of periods) {
      expect(period.closest('[aria-hidden="true"]')).not.toBeNull();
    }
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
