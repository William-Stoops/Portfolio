import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const VIDEO = {
  youtubeId: 'K_TsQ0Itoek',
  startSeconds: 3741,
  title: 'Pitch de STAXX au concours Epitech Summit',
};

describe('YouTubeFacade', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads nothing from YouTube until the visitor asks for the video', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    expect(screen.container.querySelector('iframe')).toBeNull();
    await expect
      .element(screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }))
      .toBeVisible();
  });

  it('opens the privacy-enhanced player at the start time, in a dialog covering the viewport', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    const dialog = screen.getByRole('dialog', { name: VIDEO.title });
    await expect.element(dialog).toBeVisible();
    const { width, height } = dialog.element().getBoundingClientRect();
    expect({ width, height }).toEqual({ width: window.innerWidth, height: window.innerHeight });
    const player = dialog.getByTitle(VIDEO.title);
    await expect
      .element(player)
      .toHaveAttribute(
        'src',
        'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
      );
    await expect.element(dialog.getByRole('button', { name: 'Fermer la vidéo' })).toHaveFocus();
    await expect
      .element(player)
      .toHaveAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-presentation allow-popups',
      );
  });

  it('stops the video when closed and gives focus back to the play button', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);
    const playButton = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });
    await playButton.click();

    await screen.getByRole('button', { name: 'Fermer la vidéo' }).click();

    expect(screen.getByRole('dialog').elements()).toHaveLength(0);
    expect(screen.container.querySelector('iframe')).toBeNull();
    await expect.element(playButton).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);
    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();
    await expect.element(screen.getByRole('dialog')).toBeVisible();

    await userEvent.keyboard('{Escape}');

    expect(screen.getByRole('dialog').elements()).toHaveLength(0);
    expect(screen.container.querySelector('iframe')).toBeNull();
  });

  it('shows an optional backdrop behind the play button, as decoration', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} backdrop={<span>STAXX</span>} />);

    const button = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });
    await expect.element(button).toHaveAccessibleName(`Lire la vidéo : ${VIDEO.title}`);
    expect(screen.getByText('STAXX').element().closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('always offers the video on YouTube, announced as opening a new tab', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    const link = screen.getByRole('link', { name: 'Ouvrir la vidéo sur YouTube (nouvel onglet)' });
    await expect
      .element(link)
      .toHaveAttribute('href', 'https://www.youtube.com/watch?v=K_TsQ0Itoek&t=3741s');
    await expect.element(link).toHaveAttribute('target', '_blank');
  });

  it('goes fullscreen where allowed, and closes when fullscreen ends', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);
    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();
    await expect.poll(() => document.fullscreenElement).not.toBeNull();

    await document.exitFullscreen();

    await expect.poll(() => screen.getByRole('dialog').elements()).toHaveLength(0);
  });

  for (const { browser, refuse } of [
    {
      browser: 'without the Fullscreen API (iPhone)',
      refuse: () => vi.spyOn(Document.prototype, 'fullscreenEnabled', 'get').mockReturnValue(false),
    },
    {
      browser: 'that refuses fullscreen',
      refuse: () =>
        vi
          .spyOn(Element.prototype, 'requestFullscreen')
          .mockRejectedValue(new TypeError('Permissions check failed')),
    },
  ]) {
    it(`still covers the viewport in a browser ${browser}`, async () => {
      refuse();
      const screen = await render(<YouTubeFacade video={VIDEO} />);

      await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

      const dialog = screen.getByRole('dialog', { name: VIDEO.title });
      await expect.element(dialog.getByTitle(VIDEO.title)).toBeVisible();
      const { width, height } = dialog.element().getBoundingClientRect();
      expect({ width, height }).toEqual({ width: window.innerWidth, height: window.innerHeight });
      expect(document.fullscreenElement).toBeNull();
    });
  }

  it('has no axe violations, closed or open', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);
    await expectNoAxeViolations(screen.container);

    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    await expectNoAxeViolations(screen.container);
  });
});
