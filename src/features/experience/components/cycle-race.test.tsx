import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { CycleRace } from '@/features/experience/components/cycle-race';
import { CYCLE_RACE as CYCLE_RACE_EN } from '@/features/experience/data/cycle-race.en';
import { CYCLE_RACE } from '@/features/experience/data/cycle-race.fr';
import { emulateMediaQuery } from '@/testing/emulate-media-query';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

afterEach(() => {
  vi.restoreAllMocks();
});

// Each version as the race lists it: its name and pace, then where it stands.
function lanesOf(container: Element): string[][] {
  return [...container.querySelectorAll('dt')].map((term) => [
    term.textContent,
    term.nextElementSibling?.textContent ?? '',
  ]);
}

describe('CycleRace', () => {
  it('puts both versions on the start line, each with the pace of its cycle, to scale', async () => {
    const screen = await render(<CycleRace race={CYCLE_RACE} />);

    await expect
      .element(screen.getByRole('heading', { level: 5, name: 'Un cycle complet, à l’échelle' }))
      .toBeVisible();
    await expect.element(screen.getByText('1 heure = 1,2 seconde')).toBeVisible();
    expect(lanesOf(screen.container)).toEqual([
      ['Avant la refonte10 h par cycle', '0 / 1 cycle'],
      ['Après5 min par cycle', '0 cycle'],
    ]);
    await expect.element(screen.getByText('Temps simulé : 0 h 00')).toBeVisible();
    await expect
      .element(screen.getByRole('button', { name: 'Lancer les deux calculs' }))
      .toBeVisible();
  });

  it('shows and says the result when the visitor starts it, at once with reduced motion', async () => {
    emulateMediaQuery('(prefers-reduced-motion: reduce)', true);
    const screen = await render(<CycleRace race={CYCLE_RACE} />);

    await screen.getByRole('button', { name: 'Lancer les deux calculs' }).click();

    await expect
      .element(screen.getByRole('button', { name: 'Relancer les deux calculs' }))
      .toBeVisible();
    expect(lanesOf(screen.container)).toEqual([
      ['Avant la refonte10 h par cycle', '1 / 1 cycle'],
      ['Après5 min par cycle', '120 cycles'],
    ]);
    await expect.element(screen.getByText('Temps simulé : 10 h 00')).toBeVisible();
    const result = screen.getByRole('status').element();
    expect(result.getAttribute('aria-live')).toBe('polite');
    expect(result.textContent).toBe(
      'Pendant qu’un cycle d’avant s’achève, la version refondue en boucle 120\u202F: des valeurs de nouveau à jour.',
    );
  });

  it('races in English on the English page', async () => {
    emulateMediaQuery('(prefers-reduced-motion: reduce)', true);
    const screen = await render(<CycleRace race={CYCLE_RACE_EN} />);

    await screen.getByRole('button', { name: 'Run both computations' }).click();

    expect(lanesOf(screen.container)).toEqual([
      ['Before the redesign10 h per cycle', '1 / 1 cycle'],
      ['After5 min per cycle', '120 cycles'],
    ]);
    await expect.element(screen.getByText('Simulated time: 10 h 00')).toBeVisible();
    expect(screen.getByRole('status').element().textContent).toBe(
      'While one old cycle completes, the redesigned version runs 120: values up to date again.',
    );
  });

  it('has no accessibility violations', async () => {
    const screen = await render(<CycleRace race={CYCLE_RACE} />);

    await expectNoAxeViolations(screen.container);
  });
});
