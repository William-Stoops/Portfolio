import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { PageSection } from '@/components/layout/page-section';

describe('PageSection', () => {
  it('is a region named by its level-2 heading and reachable by its anchor', async () => {
    const screen = await render(
      <PageSection id="exemple" title="Exemple">
        <p>Contenu</p>
      </PageSection>,
    );

    const region = screen.getByRole('region', { name: 'Exemple' });
    await expect.element(region).toHaveAttribute('id', 'exemple');
    await expect.element(region.getByRole('heading', { level: 2, name: 'Exemple' })).toBeVisible();
    await expect.element(region.getByText('Contenu')).toBeVisible();
  });

  it('places an optional lead right under the heading, before the content', async () => {
    const screen = await render(
      <PageSection id="exemple" title="Exemple" lead={<p>Introduction</p>}>
        <p>Contenu</p>
      </PageSection>,
    );

    const texts = [...screen.container.querySelectorAll('h2, p')].map((node) => node.textContent);
    expect(texts.filter((text) => text !== '')).toEqual(['Exemple', 'Introduction', 'Contenu']);
  });

  it('numbers a home section, as decoration only', async () => {
    const screen = await render(
      <PageSection id="ia" title="Intelligence artificielle">
        <p>Contenu</p>
      </PageSection>,
    );

    const number = screen.getByText('01', { exact: true });
    expect(number.element().closest('[aria-hidden="true"]')).not.toBeNull();
    await expect
      .element(screen.getByRole('heading', { level: 2 }))
      .toHaveAccessibleName('Intelligence artificielle');
  });

  it('can keep its title for assistive tech only, opening straight on its content', async () => {
    const screen = await render(
      <PageSection id="parcours" title="Parcours" isTitleHidden>
        <p>Contenu</p>
      </PageSection>,
    );

    const region = screen.getByRole('region', { name: 'Parcours' });
    await expect.element(region).toHaveAttribute('id', 'parcours');
    await expect
      .element(region.getByRole('heading', { level: 2, name: 'Parcours' }))
      .toHaveClass('sr-only');
    expect(screen.container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('sets the title whole, from the first paint', async () => {
    const screen = await render(
      <PageSection id="parcours" title="Mon parcours">
        <p>Contenu</p>
      </PageSection>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    await expect.element(heading).toHaveAccessibleName('Mon parcours');
    expect(heading.element().textContent).toBe('Mon parcours');
  });
});
