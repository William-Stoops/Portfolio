import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { BehindTheScenesPage } from '@/features/behind-the-scenes/components/behind-the-scenes-page';
import { BEHIND_THE_SCENES as CONTENT_EN } from '@/features/behind-the-scenes/data/behind-the-scenes.en';
import { BEHIND_THE_SCENES } from '@/features/behind-the-scenes/data/behind-the-scenes.fr';
import { SITE_FACTS } from '@/features/behind-the-scenes/data/site-facts';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

function headingsOf(container: Element, level: number): string[] {
  return [...container.querySelectorAll(`h${String(level)}`)].map(({ textContent }) => textContent);
}

describe('BehindTheScenesPage', () => {
  it('tells how the site is made: live measures, what the CI turns down, the decisions', async () => {
    const screen = await render(<BehindTheScenesPage content={BEHIND_THE_SCENES} />);

    expect(headingsOf(screen.container, 2)).toEqual([
      'Mesuré à l’instant, dans votre navigateur',
      'Ce que la CI refuse',
      'Les décisions',
    ]);
    expect(headingsOf(screen.container, 3)).toEqual([
      'Un type approximatif',
      'Un avertissement',
      'Du code mort',
      'Une régression',
      'Une barrière d’accessibilité',
      'Du poids en trop',
    ]);
    await expect
      .element(
        screen.getByText(`${String(SITE_FACTS.decisions)} décisions d’architecture`, {
          exact: false,
        }),
      )
      .toBeVisible();
  });

  it('opens the public code and the decisions in a new tab, and says so', async () => {
    const screen = await render(<BehindTheScenesPage content={BEHIND_THE_SCENES} />);

    const code = screen.getByRole('link', { name: 'Voir le code sur GitHub (nouvel onglet)' });
    await expect
      .element(code)
      .toHaveAttribute('href', 'https://github.com/William-Stoops/Portfolio');
    await expect.element(code).toHaveAttribute('target', '_blank');
    await expect.element(code).toHaveAttribute('rel', 'noopener noreferrer');
    await expect
      .element(screen.getByRole('link', { name: 'Lire les décisions sur GitHub (nouvel onglet)' }))
      .toHaveAttribute('href', 'https://github.com/William-Stoops/Portfolio/tree/main/docs/adr');
  });

  it('speaks English on the English page', async () => {
    const screen = await render(<BehindTheScenesPage content={CONTENT_EN} />);

    expect(headingsOf(screen.container, 2)).toEqual([
      'Measured just now, in your browser',
      'What the CI turns down',
      'The decisions',
    ]);
    await expect
      .element(screen.getByRole('link', { name: 'See the code on GitHub (new tab)' }))
      .toBeVisible();
  });

  it('has no accessibility violations', async () => {
    const screen = await render(<BehindTheScenesPage content={BEHIND_THE_SCENES} />);

    await expectNoAxeViolations(screen.container);
  });
});
