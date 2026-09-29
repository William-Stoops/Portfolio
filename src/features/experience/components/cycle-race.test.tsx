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
  it('puts both versions on the start line, each with the pace of its cycle', async () => {
    const screen = await render(<CycleRace race={CYCLE_RACE} />);

    await expect
      .element(
        screen.getByRole('heading', {
          level: 4,
          name: 'Un cycle de calcul, avant et après la refonte',
        }),
      )
      .toBeVisible();
    expect(lanesOf(screen.container)).toEqual([
      ['Avant la refonte · 10\u202Fh par cycle', 'Temps de calcul écoulé 00:00'],
      ['Après la refonte · 5\u202Fmin par cycle', '0 cycle terminé'],
    ]);
    await expect.element(screen.getByRole('button', { name: 'Lancer la course' })).toBeVisible();
  });

  it('shows and says the result when the visitor starts it, at once with reduced motion', async () => {
    emulateMediaQuery('(prefers-reduced-motion: reduce)', true);
    const screen = await render(<CycleRace race={CYCLE_RACE} />);

    await screen.getByRole('button', { name: 'Lancer la course' }).click();

    await expect.element(screen.getByRole('button', { name: 'Relancer la course' })).toBeVisible();
    expect(lanesOf(screen.container)).toEqual([
      ['Avant la refonte · 10\u202Fh par cycle', 'Temps de calcul écoulé 10:00'],
      ['Après la refonte · 5\u202Fmin par cycle', '120 cycles terminés'],
    ]);
    const result = screen.getByRole('status').element();
    expect(result.getAttribute('aria-live')).toBe('polite');
    expect(result.textContent).toBe(
      'Pendant qu’un cycle d’avant s’achève, la version refondue en boucle 120 : des valeurs de nouveau à jour.',
    );
  });

  it('races in English on the English page', async () => {
    emulateMediaQuery('(prefers-reduced-motion: reduce)', true);
    const screen = await render(<CycleRace race={CYCLE_RACE_EN} />);

    await screen.getByRole('button', { name: 'Start the race' }).click();

    expect(lanesOf(screen.container)).toEqual([
      ['Before the redesign · 10\u202Fh per cycle', 'Computing time elapsed 10:00'],
      ['After the redesign · 5\u202Fmin per cycle', '120 cycles completed'],
    ]);
    expect(screen.getByRole('status').element().textContent).toBe(
      'While one old cycle completes, the redesigned version runs 120: values up to date again.',
    );
  });

  it('has no accessibility violations', async () => {
    const screen = await render(<CycleRace race={CYCLE_RACE} />);

    await expectNoAxeViolations(screen.container);
  });
});
