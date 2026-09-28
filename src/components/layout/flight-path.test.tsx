import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { FlightPath } from '@/components/layout/flight-path';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const WAYPOINTS = [
  { id: 'a-propos', value: '01', label: 'À propos' },
  { id: 'annee-2021', value: '2021', label: '1re année' },
];

// What a line of the board shows at rest: the character of each cell.
function boardText(line: Element): string {
  return [...line.querySelectorAll('[data-flap-character]')]
    .map((character) => character.textContent)
    .join('');
}

async function renderPath() {
  return render(
    <FlightPath waypoints={WAYPOINTS}>
      <section aria-label="Contenu">
        <p>Contenu</p>
      </section>
    </FlightPath>,
  );
}

describe('FlightPath', () => {
  it('holds the sections of the page', async () => {
    const screen = await renderPath();

    await expect.element(screen.getByRole('region', { name: 'Contenu' })).toBeVisible();
  });

  it('draws the rail and its plane as decoration', async () => {
    const screen = await renderPath();

    const rail = screen.container.querySelector('[data-flight-rail]');
    expect(rail?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('lists every waypoint beside the rail, in order, as decoration', async () => {
    const screen = await renderPath();

    const waypoints = [...screen.container.querySelectorAll('[data-waypoint]')];
    expect(waypoints.map((waypoint) => boardText(waypoint))).toEqual([
      '01À propos',
      '20211re année',
    ]);
    for (const waypoint of waypoints) {
      expect(waypoint.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('turns each line of the board from the line before, as a departures board', async () => {
    const screen = await renderPath();

    const [, year] = [...screen.container.querySelectorAll('[data-waypoint]')];
    const strips = [...(year?.querySelectorAll('[data-flap-character] + *') ?? [])].map(
      (strip) => strip.textContent,
    );
    // "01" then blank cells, turning into "2021".
    expect(strips.slice(0, 4).map((strip) => strip.split('\n')[0])).toEqual(['0', '1', ' ', ' ']);
    expect(strips.slice(0, 4).map((strip) => strip.split('\n').at(-1))).toEqual([
      '2',
      '0',
      '2',
      '1',
    ]);
  });

  it('shares the waypoints’ timelines and the flights’ with the whole page', async () => {
    const screen = await renderPath();

    const path = screen.container.firstElementChild;
    expect(path instanceof HTMLElement ? path.style.getPropertyValue('--scope') : '').toBe(
      '--wp-a-propos, --wp-annee-2021, --voyage, --homecoming',
    );
  });

  it('has no axe violations', async () => {
    const screen = await renderPath();

    await expectNoAxeViolations(screen.container);
  });
});
