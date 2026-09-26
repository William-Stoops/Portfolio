import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { FlightLog } from '@/components/layout/flight-log';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const STOPS = [
  {
    id: 'annee-2021',
    overline: '2021 · 1re année',
    filigree: '2021',
    title: 'Epitech',
    content: <p>Contenu A</p>,
  },
  {
    id: 'coree',
    overline: '2024 · 4e année',
    filigree: '2024',
    title: 'Séoul',
    headingId: 'coree-titre',
    content: <p>Contenu B</p>,
  },
];

describe('FlightLog', () => {
  it('orders the stops, each with its own anchor, level-3 heading and content', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    expect(
      screen
        .getByRole('listitem')
        .elements()
        .map((stop) => stop.id),
    ).toEqual(['annee-2021', 'coree']);
    await expect
      .element(screen.getByRole('heading', { level: 3, name: 'Séoul' }))
      .toHaveAttribute('id', 'coree-titre');
    await expect.element(screen.getByText('Contenu B')).toBeInTheDocument();
  });

  it('watches each stop through its own timeline, for the marker and the path’s labels', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    expect(
      screen
        .getByRole('listitem')
        .elements()
        .map((stop) => stop.style.getPropertyValue('--timeline')),
    ).toEqual(['--wp-annee-2021', '--wp-coree']);
  });

  it('marks each stop on the rail, as decoration', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    expect(
      screen.container.querySelectorAll('[data-stop-marker][aria-hidden="true"]'),
    ).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    const screen = await render(<FlightLog stops={STOPS} />);

    await expectNoAxeViolations(screen.container);
  });
});
