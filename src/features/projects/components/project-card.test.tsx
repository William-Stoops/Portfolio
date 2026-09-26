import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ProjectCard } from '@/features/projects/components/project-card';
import { PROJECTS } from '@/features/projects/data/projects';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const [STAXX] = PROJECTS;

async function renderSection() {
  return render(
    <div className="@container">
      <ProjectCard project={STAXX} />
    </div>,
  );
}

describe('ProjectCard', () => {
  it('is an article titled by the project, at level 4 under its stop', async () => {
    const screen = await renderSection();

    await expect.element(screen.getByRole('heading', { level: 4, name: 'STAXX' })).toBeVisible();
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

  it('opens the case study with the project in three figures', async () => {
    const screen = await renderSection();

    const figures = screen.getByRole('list', { name: 'STAXX en chiffres' });
    expect(
      figures
        .getByRole('listitem')
        .elements()
        .map((item) => item.textContent),
    ).toEqual(PROJECTS[0].figures.map(({ value, label }) => `${value} ${label}`));
  });

  it('sets the Epitech Summit photo in the case study, captioned and loaded lazily', async () => {
    const screen = await renderSection();

    const photo = screen
      .getByRole('article', { name: 'STAXX' })
      .getByRole('figure', { name: /Epitech Summit/ });
    const image = photo.getByRole('img', { name: PROJECTS[0].photo.alt });
    await expect.element(image).toHaveAttribute('loading', 'lazy');
    await expect.element(photo.getByText(PROJECTS[0].photo.caption)).toBeVisible();
  });

  it('shows the NRJ Lille appearance as a captioned pair of photos, loaded lazily', async () => {
    const screen = await renderSection();

    const press = screen
      .getByRole('article', { name: 'STAXX' })
      .getByRole('figure', { name: /NRJ Lille/ });
    const images = press.getByRole('img').elements();
    expect(images.map((image) => image.getAttribute('alt'))).toEqual(
      PROJECTS[0].press.photos.map(({ alt }) => alt),
    );
    expect(images.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
    await expect.element(press.getByText(PROJECTS[0].press.summary)).toBeVisible();
  });

  it('has no axe violations', async () => {
    const screen = await renderSection();

    await expectNoAxeViolations(screen.container);
  });
});
