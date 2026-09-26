import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { FlightLog } from '@/components/layout/flight-log';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const STOPS = [
  { id: 'annee-2021', year: 2021, label: '1re année', title: 'Epitech', content: <p>Contenu A</p> },
  { id: 'coree', year: 2024, label: '4e année', title: 'Séoul', content: <p>Contenu B</p> },
];

describe('FlightLog', () => {
  it('gives each stop its level-3 heading and its own anchor, followed by its content', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    const stops = screen.getByRole('listitem').elements();
    expect(stops.map((stop) => stop.id)).toEqual(['annee-2021', 'coree']);
    // Read as one title each; their letters rise one by one for the eyes, hidden from AT.
    expect(
      screen
        .getByRole('heading', { level: 3 })
        .elements()
        .map((heading) => heading.querySelector('.sr-only')?.textContent),
    ).toEqual(['Epitech', 'Séoul']);
    await expect
      .element(screen.getByRole('heading', { level: 3, name: 'Séoul' }))
      .toBeInTheDocument();
    await expect.element(screen.getByText('Contenu B')).toBeInTheDocument();
  });

  it('says each stop’s year and label in words', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    for (const text of ['2021 · 1re année', '2024 · 4e année']) {
      const year = screen.getByText(text, { exact: true }).element();
      expect(year.closest('[aria-hidden="true"]')).toBeNull();
    }
  });

  it('draws the rail, its plane and the rolling year as decoration', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    for (const selector of ['[data-flight-rail]', '[data-odometer]']) {
      expect(
        screen.container.querySelector(selector)?.closest('[aria-hidden="true"]'),
      ).not.toBeNull();
    }
  });

  it('rolls the year’s last digits from one stop to the next', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    const odometer = screen.container.querySelector('[data-odometer]');
    expect(odometer?.querySelector('[data-odometer-fixed]')?.textContent).toBe('202');
    expect(
      [...(odometer?.querySelectorAll('[data-odometer-digit]') ?? [])].map(
        (digit) => digit.textContent,
      ),
    ).toEqual(['1', '4']);
  });

  it('marks each stop’s arrival on the rail, and sets its year in filigree, as decoration', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    expect(
      screen.container.querySelectorAll('[data-stop-marker][aria-hidden="true"]'),
    ).toHaveLength(2);
    expect(
      [...screen.container.querySelectorAll('[data-stop-year]')].map((year) => ({
        year: getComputedStyle(year, '::before').content,
        text: year.textContent,
        hidden: year.getAttribute('aria-hidden'),
      })),
    ).toEqual([
      { year: '"2021"', text: '', hidden: 'true' },
      { year: '"2024"', text: '', hidden: 'true' },
    ]);
  });

  it('has no axe violations', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    await expectNoAxeViolations(screen.container);
  });
});
