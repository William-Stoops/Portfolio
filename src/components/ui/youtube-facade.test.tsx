import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { LocaleContext } from '@/i18n/locale-context';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const VIDEO = {
  youtubeId: 'K_TsQ0Itoek',
  startSeconds: 3741,
  title: 'Pitch de STAXX au concours Epitech Summit',
};

const POSTER = {
  picture: {
    basePath: '/images/staxx-pitch-v1',
    widths: [640],
    formats: ['jpg'],
    width: 1920,
    height: 1080,
  },
  sizes: '100vw',
} as const;

describe('YouTubeFacade', () => {
  it('loads nothing from YouTube until the visitor asks for the video', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

    expect(screen.container.querySelector('iframe')).toBeNull();
    await expect
      .element(screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }))
      .toBeVisible();
  });

  it('draws the poster behind the play button, as decoration', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

    const button = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });
    const poster = button.element().querySelector('img');
    expect(poster?.getAttribute('src')).toBe('/images/staxx-pitch-v1-640.jpg');
    expect(poster?.getAttribute('alt')).toBe('');
    expect(poster?.getAttribute('loading')).toBe('lazy');
  });

  it('plays the privacy-enhanced player right where the poster was, at its start time', async () => {
    const screen = await render(
      <div style={{ width: '40rem' }}>
        <YouTubeFacade video={VIDEO} poster={POSTER} />
      </div>,
    );
    const button = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });
    const posterBox = button.element().getBoundingClientRect();

    await button.click();

    const player = screen.getByTitle(VIDEO.title);
    await expect
      .element(player)
      .toHaveAttribute(
        'src',
        'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
      );
    const playerBox = player.element().getBoundingClientRect();
    expect([playerBox.left, playerBox.top, playerBox.width, playerBox.height]).toEqual([
      posterBox.left,
      posterBox.top,
      posterBox.width,
      posterBox.height,
    ]);
    expect(screen.container.querySelector('dialog')).toBeNull();
    expect(screen.getByRole('button').elements()).toHaveLength(0);
  });

  it('gives the focus to the player, which the play button has left', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    await expect.element(screen.getByTitle(VIDEO.title)).toHaveFocus();
  });

  it('cuts the title into the frame when the picture keeps room for it', async () => {
    const screen = await render(
      <div style={{ width: '50rem' }}>
        <YouTubeFacade video={VIDEO} poster={POSTER} />
      </div>,
    );

    await expect.element(screen.getByText('Lire la vidéo', { exact: true })).toBeVisible();
  });

  it('keeps a small frame to its picture and its play button, still named', async () => {
    const screen = await render(
      <div style={{ width: '20rem' }}>
        <YouTubeFacade video={VIDEO} poster={POSTER} />
      </div>,
    );

    await expect.element(screen.getByText('Lire la vidéo', { exact: true })).not.toBeVisible();
    await expect
      .element(screen.getByRole('button'))
      .toHaveAccessibleName(`Lire la vidéo : ${VIDEO.title}`);
  });

  it('speaks the language of the page', async () => {
    const screen = await render(
      <LocaleContext value="en">
        <YouTubeFacade video={VIDEO} poster={POSTER} />
      </LocaleContext>,
    );

    await expect
      .element(screen.getByRole('button', { name: `Play the video: ${VIDEO.title}` }))
      .toBeVisible();
  });

  it('has no axe violations, before and while playing', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);
    await expectNoAxeViolations(screen.container);

    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    await expectNoAxeViolations(screen.container);
  });
});
