import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { StopHeader } from '@/components/layout/stop-header';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

describe('StopHeader', () => {
  it('titles the stop at its level, read as one title while its letters rise', async () => {
    const screen = await render(
      <StopHeader level={2} headingId="a-propos-titre" title="À propos" overline="01" />,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'À propos' });
    await expect.element(heading).toHaveAttribute('id', 'a-propos-titre');
    const letters = heading.element().querySelectorAll('[aria-hidden="true"] [style*="--i"]');
    expect([...letters].map((letter) => letter.textContent).join('')).toBe('Àpropos');
  });

  it('says the overline in words, unless it is decoration', async () => {
    const said = await render(<StopHeader level={3} title="Séoul" overline="2024 · 4e année" />);
    expect(said.getByText('2024 · 4e année').element().closest('[aria-hidden="true"]')).toBeNull();

    const decoration = await render(
      <StopHeader level={2} title="Parcours" overline="02" isOverlineDecoration />,
    );
    expect(
      decoration.getByText('02', { exact: true }).element().closest('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it('marks the stop on the rail and sets its filigree, as decoration drawn by CSS', async () => {
    const screen = await render(
      <StopHeader level={3} title="Séoul" overline="2024 · 4e année" filigree="2024" onPath />,
    );

    expect(screen.container.querySelector('[data-stop-marker]')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    const filigree = screen.container.querySelector('[data-filigree]');
    expect(filigree?.getAttribute('aria-hidden')).toBe('true');
    expect(filigree?.textContent).toBe('');
    expect(filigree === null ? '' : getComputedStyle(filigree, '::before').content).toBe('"2024"');
  });

  it('opens a chapter off the flight path: no marker, and its overline always shown', async () => {
    const screen = await render(
      <StopHeader level={2} title="IA" overline="03" isOverlineDecoration />,
    );

    expect(screen.container.querySelector('[data-stop-marker]')).toBeNull();
    expect(
      screen.getByText('03', { exact: true }).element().classList.contains('chapter-heading'),
    ).toBe(false);
  });

  it('has no axe violations', async () => {
    const screen = await render(
      <StopHeader level={2} title="À propos" overline="01" isOverlineDecoration filigree="01" />,
    );

    await expectNoAxeViolations(screen.container);
  });
});
