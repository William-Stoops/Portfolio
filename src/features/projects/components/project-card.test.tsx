import { assert, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ProjectCard } from '@/features/projects/components/project-card';
import {
  PROJECT_LABELS as PROJECT_LABELS_EN,
  PROJECTS as PROJECTS_EN,
} from '@/features/projects/data/projects.en';
import { PROJECT_LABELS, PROJECTS } from '@/features/projects/data/projects.fr';
import { LocaleContext } from '@/i18n/locale-context';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const [STAXX] = PROJECTS;

async function renderSection() {
  return render(
    <div className="@container">
      <ProjectCard project={STAXX} labels={PROJECT_LABELS} />
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
      .getByRole('figure', { name: /^Epitech Summit/ });
    const image = photo.getByRole('img', { name: PROJECTS[0].photo.alt });
    await expect.element(image).toHaveAttribute('loading', 'lazy');
    await expect.element(photo.getByText(PROJECTS[0].photo.caption)).toBeVisible();
  });

  it('shows the win as the photo itself: no room, no spotlights, no veil', async () => {
    const screen = await renderSection();

    const photo = screen
      .getByRole('article', { name: 'STAXX' })
      .getByRole('figure', { name: /^Epitech Summit/ })
      .element();
    expect(photo.querySelectorAll('img')).toHaveLength(1);
    expect(photo.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it('sets the pitch as a captioned figure, on the frame the video opens on', async () => {
    const screen = await renderSection();

    const pitch = screen
      .getByRole('article', { name: 'STAXX' })
      .getByRole('figure', { name: /^Le pitch/ });
    await expect.element(pitch.getByText(PROJECTS[0].pitch.caption)).toBeVisible();
    const playButton = pitch.getByRole('button', { name: /^Lire la vidéo/ });
    expect(playButton.element().querySelector('img')?.getAttribute('src')).toMatch(
      /^\/images\/staxx-pitch-v1-/,
    );
  });

  it('tells STAXX in the order it happened: the radio, the pitch, then the win', async () => {
    const screen = await renderSection();

    const staxx = screen.getByRole('article', { name: 'STAXX' });
    const [radio, pitch, win] = [/^À la radio/, /^Le pitch/, /^Epitech Summit/].map((name) =>
      staxx.getByRole('figure', { name }).element(),
    );
    assert(radio !== undefined && pitch !== undefined && win !== undefined);
    expect(radio.compareDocumentPosition(pitch) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pitch.compareDocumentPosition(win) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

  it('draws the English case study, from its tagline to the radio', async () => {
    const [staxx] = PROJECTS_EN;
    const screen = await render(
      <LocaleContext value="en">
        <div className="@container">
          <ProjectCard project={staxx} labels={PROJECT_LABELS_EN} />
        </div>
      </LocaleContext>,
    );

    const article = screen.getByRole('article', { name: 'STAXX' });
    await expect.element(article.getByText('Since 2024')).toBeVisible();
    await expect.element(article.getByRole('list', { name: 'STAXX in figures' })).toBeVisible();
    await expect.element(article.getByRole('figure', { name: /^The pitch/ })).toBeVisible();
    await expect.element(article.getByRole('figure', { name: /^On the radio/ })).toBeVisible();
  });
});
