import { describe, expect, it } from 'vitest';

import { DestinationBoard } from '@/components/layout/destination-board';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';
import { renderInRouter } from '@/testing/render-with-router';

const DESTINATIONS = [
  { label: 'Accueil', path: '/fr' },
  { label: 'Parcours', href: '/fr#parcours' },
  { label: 'Plan du site', path: '/fr/plan-du-site' },
] as const;

describe('DestinationBoard', () => {
  it('lists where to go next under its title, as a navigation of its own', async () => {
    const screen = await renderInRouter(
      <DestinationBoard title="Autres destinations" destinations={DESTINATIONS} />,
    );

    const navigation = screen.getByRole('navigation', { name: 'Autres destinations' });
    await expect.element(navigation).toBeVisible();
    await expect
      .element(screen.getByRole('heading', { level: 2, name: 'Autres destinations' }))
      .toBeVisible();
    expect(
      navigation
        .getByRole('link')
        .elements()
        .map((link) => [link.textContent, link.getAttribute('href')]),
    ).toEqual([
      ['Accueil', '/fr'],
      ['Parcours', '/fr#parcours'],
      ['Plan du site', '/fr/plan-du-site'],
    ]);
  });

  it('gives every destination a target a finger can hit', async () => {
    const screen = await renderInRouter(
      <DestinationBoard title="Autres destinations" destinations={DESTINATIONS} />,
    );

    await expectNoAxeViolations(screen.container);
    const heights = screen
      .getByRole('link')
      .elements()
      .map((link) => link.getBoundingClientRect().height);
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
  });
});
