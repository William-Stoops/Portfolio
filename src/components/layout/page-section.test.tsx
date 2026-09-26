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

    // The heading's text as read: its visually hidden copy (the rising letters are hidden).
    const texts = [...screen.container.querySelectorAll('h2 .sr-only, p')].map(
      (node) => node.textContent,
    );
    expect(texts).toEqual(['Exemple', 'Introduction', 'Contenu']);
  });

  it('numbers a home section, as decoration only', async () => {
    const screen = await render(
      <PageSection id="parcours" title="Parcours">
        <p>Contenu</p>
      </PageSection>,
    );

    const number = screen.getByText('02', { exact: true });
    expect(number.element().closest('[aria-hidden="true"]')).not.toBeNull();
    await expect
      .element(screen.getByRole('heading', { level: 2 }))
      .toHaveAccessibleName('Parcours');
  });

  it('reads the title as one word group while its letters rise for the eyes only', async () => {
    const screen = await render(
      <PageSection id="parcours" title="Mon parcours">
        <p>Contenu</p>
      </PageSection>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    await expect.element(heading).toHaveAccessibleName('Mon parcours');
    const letters = heading.element().querySelectorAll('[aria-hidden="true"] [style*="--i"]');
    expect([...letters].map((letter) => letter.textContent).join('')).toBe('Monparcours');
  });
});
