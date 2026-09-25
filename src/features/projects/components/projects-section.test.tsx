import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ProjectsSection } from '@/features/projects/components/projects-section';
import { PROJECTS } from '@/features/projects/data/projects';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

async function renderSection() {
  return render(<ProjectsSection projects={PROJECTS} />);
}

describe('ProjectsSection', () => {
  it('is a region named by its heading and reachable by the #projets anchor', async () => {
    const screen = await renderSection();

    await expect
      .element(screen.getByRole('region', { name: 'Projets' }))
      .toHaveAttribute('id', 'projets');
  });

  it('presents STAXX as an article with its tagline, period and emphasised award', async () => {
    const screen = await renderSection();

    const staxx = screen.getByRole('article', { name: 'STAXX' });
    await expect
      .element(staxx.getByText('Plateforme de commande de matériel pour le BTP'))
      .toBeVisible();
    await expect.element(staxx.getByText('Depuis 2024')).toBeVisible();
    expect(
      [...screen.container.querySelectorAll('strong')].map((strong) => strong.textContent),
    ).toContain('1er au concours Epitech Summit');
  });

  it('lists its technologies and offers the pitch video without loading it', async () => {
    const screen = await renderSection();

    await expect
      .element(screen.getByRole('list', { name: 'Technologies utilisées' }))
      .toBeVisible();
    await expect.element(screen.getByRole('button', { name: /^Lire la vidéo/ })).toBeVisible();
    expect(screen.container.querySelector('iframe')).toBeNull();
  });

  it('has no axe violations', async () => {
    const screen = await renderSection();

    await expectNoAxeViolations(screen.container);
  });
});
