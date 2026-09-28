import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ExperienceCard } from '@/features/experience/components/experience-card';
import { EXPERIENCES } from '@/features/experience/data/experiences';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const [IT_FINANCE, INTM, STRATTT] = EXPERIENCES;

describe('ExperienceCard', () => {
  it('is an article titled with the role and the company, at level 4 under its stop', async () => {
    const screen = await render(<ExperienceCard experience={IT_FINANCE} />);

    const heading = screen.getByRole('heading', { level: 4 });
    await expect
      .element(heading)
      .toHaveTextContent('Software Engineer, IT-Finance, éditeur de ProRealTime');
    await expect.element(screen.getByRole('article', { name: /IT-Finance/ })).toBeInTheDocument();
  });

  it('marks the English job title', async () => {
    const screen = await render(<ExperienceCard experience={IT_FINANCE} />);

    await expect.element(screen.getByText('Software Engineer')).toHaveAttribute('lang', 'en');
  });

  it('shows the period of the role', async () => {
    const screen = await render(<ExperienceCard experience={STRATTT} />);

    await expect.element(screen.getByText('2022 – 2024', { exact: true })).toBeVisible();
  });

  it('emphasises the passages the CV sets in bold, without leaking the markers', async () => {
    const screen = await render(<ExperienceCard experience={IT_FINANCE} />);

    const strongTexts = [...screen.container.querySelectorAll('strong')].map(
      (strong) => strong.textContent,
    );
    expect(strongTexts).toContain('de 10 heures à 5 minutes');
    expect(screen.container.textContent).not.toContain('**');
  });

  it('lists the technologies the CV names', async () => {
    const screen = await render(<ExperienceCard experience={INTM} />);

    await expect
      .element(screen.getByRole('list', { name: 'Technologies utilisées' }))
      .toBeVisible();
  });

  it('lists no technologies when the CV names none', async () => {
    const screen = await render(<ExperienceCard experience={STRATTT} />);

    expect(screen.container.querySelector('[aria-label="Technologies utilisées"]')).toBeNull();
  });

  // The card adapts to its own width (container query), not to the viewport.
  it.each([
    { width: 360, direction: 'column' },
    { width: 800, direction: 'row' },
  ])(
    'lays its header out as a $direction in a $width px container',
    async ({ width, direction }) => {
      const screen = await render(
        <div className="@container" style={{ width }}>
          <ExperienceCard experience={IT_FINANCE} />
        </div>,
      );

      const header = screen.container.querySelector('article header');
      expect(header === null ? '' : getComputedStyle(header).flexDirection).toBe(direction);
    },
  );

  it('has no axe violations', async () => {
    const screen = await render(<ExperienceCard experience={IT_FINANCE} />);

    await expectNoAxeViolations(screen.container);
  });
});
