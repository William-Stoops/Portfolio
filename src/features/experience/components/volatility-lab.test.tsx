import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { VolatilityLab } from '@/features/experience/components/volatility-lab';
import { CYCLE_RACE } from '@/features/experience/data/cycle-race.fr';
import { VOLATILITY_LAB } from '@/features/experience/data/volatility-lab.fr';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderLab() {
  await page.viewport(1280, 900);
  return render(
    <div className="@container">
      <VolatilityLab lab={VOLATILITY_LAB} race={CYCLE_RACE} />
    </div>,
  );
}

describe('VolatilityLab', () => {
  it('explains implied volatility beside the surface, under its own heading', async () => {
    const screen = await renderLab();

    await expect
      .element(screen.getByRole('heading', { level: 4, name: 'Volatilité implicite' }))
      .toBeVisible();
    await expect.element(screen.getByText(VOLATILITY_LAB.overline)).toBeVisible();
    await expect.element(screen.getByText(VOLATILITY_LAB.explanation)).toBeVisible();
    await expect.element(screen.getByText(VOLATILITY_LAB.hint)).toBeVisible();
  });

  it('describes the surface for those who do not see it, and gives buttons to turn it', async () => {
    const screen = await renderLab();

    const surface = screen.getByRole('figure', { name: VOLATILITY_LAB.figure });
    await expect.element(surface).toBeVisible();
    await expect.element(surface).toHaveAccessibleDescription(VOLATILITY_LAB.description);
    expect(
      surface
        .getByRole('group', { name: 'Tourner la surface' })
        .getByRole('button')
        .elements()
        .map((button) => button.textContent),
    ).toEqual([
      'Tourner à gauche',
      'Tourner à droite',
      'Incliner vers le haut',
      'Incliner vers le bas',
    ]);
  });

  it('offers buttons a finger can hit', async () => {
    const screen = await renderLab();

    const { width, height } = screen
      .getByRole('button', { name: 'Tourner à gauche' })
      .element()
      .getBoundingClientRect();
    expect(Math.min(width, height)).toBeGreaterThanOrEqual(44);
  });

  it('prints the legend of the colour scale', async () => {
    const screen = await renderLab();

    await expect.element(screen.getByText('σ 15 %')).toBeVisible();
    await expect.element(screen.getByText('30 %', { exact: true })).toBeVisible();
  });

  it('reads the point under the pointer', async () => {
    const screen = await renderLab();
    const figure = screen.getByRole('figure', { name: VOLATILITY_LAB.figure }).element();
    const canvas = figure.querySelector('canvas');
    if (canvas === null) {
      throw new Error('no canvas');
    }
    figure.scrollIntoView({ block: 'center' });

    // The surface rises from a flat heat map: point at it until it has cells to read.
    const pointAtCentre = (): string => {
      const box = canvas.getBoundingClientRect();
      canvas.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerType: 'mouse',
          clientX: box.left + box.width / 2,
          clientY: box.top + box.height / 2,
        }),
      );
      return screen.container.textContent;
    };
    await expect.poll(pointAtCentre, { timeout: 5000 }).toMatch(/σ \d+,\d\u202F%/);

    await expect.element(screen.getByText(/^σ \d+,\d %$/)).toBeVisible();
    await expect.element(screen.getByText(/^K \d+,\d$/)).toBeVisible();
  });

  it('races the two cycles under the surface', async () => {
    const screen = await renderLab();

    await expect
      .element(screen.getByRole('heading', { level: 5, name: CYCLE_RACE.title }))
      .toBeVisible();
    await expect.element(screen.getByRole('button', { name: CYCLE_RACE.start })).toBeVisible();
  });

  it('stays dark in both themes, as data charts read best', async () => {
    const screen = await renderLab();

    const panel = screen.getByRole('region', { name: 'Volatilité implicite' }).element();
    expect(getComputedStyle(panel).colorScheme).toBe('dark');
  });

  it('has no axe violations', async () => {
    const screen = await renderLab();

    await expectNoAxeViolations(screen.container);
  });
});
