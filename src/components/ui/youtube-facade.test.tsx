import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import { YouTubeFacade } from '@/components/ui/youtube-facade';
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

const typeSetDescriptor = Object.getOwnPropertyDescriptor(window, 'ViewTransitionTypeSet');

describe('YouTubeFacade', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    if (typeSetDescriptor !== undefined) {
      Object.defineProperty(window, 'ViewTransitionTypeSet', typeSetDescriptor);
    }
  });

  it('loads nothing from YouTube until the visitor asks for the video', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

    expect(screen.container.querySelector('iframe')).toBeNull();
    await expect
      .element(screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }))
      .toBeVisible();
  });

  it('opens the privacy-enhanced player at the start time, in a dialog covering the viewport', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

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
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);
    const playButton = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });
    await playButton.click();

    await screen.getByRole('button', { name: 'Fermer la vidéo' }).click();

    // The dialog's close event arrives asynchronously: wait for the player to go.
    await expect.poll(() => screen.getByRole('dialog').elements()).toHaveLength(0);
    await expect.poll(() => screen.container.querySelector('iframe')).toBeNull();
    await expect.element(playButton).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);
    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();
    await expect.element(screen.getByRole('dialog')).toBeVisible();

    await userEvent.keyboard('{Escape}');

    // The dialog's close event arrives asynchronously: wait for the player to go.
    await expect.poll(() => screen.getByRole('dialog').elements()).toHaveLength(0);
    await expect.poll(() => screen.container.querySelector('iframe')).toBeNull();
  });

  it('draws the poster behind the play button, as decoration', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

    const button = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });
    const poster = button.element().querySelector('img');
    expect(poster?.getAttribute('src')).toBe('/images/staxx-pitch-v1-640.jpg');
    expect(poster?.getAttribute('alt')).toBe('');
    expect(poster?.getAttribute('loading')).toBe('lazy');
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

  it('holds the poster in the player’s place, and shows the player once it has loaded', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);
    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    const dialog = screen.getByRole('dialog', { name: VIDEO.title });
    const player = dialog.getByTitle(VIDEO.title);
    await expect.element(player).toBeInTheDocument();
    // Loaded at once: the same file as the button's poster, already in the cache.
    expect(dialog.element().querySelector('img')?.getAttribute('loading')).toBe('eager');
    player.element().dispatchEvent(new Event('load'));

    await expect.poll(() => getComputedStyle(player.element()).opacity).toBe('1');
  });

  it('grows the poster into the player through a view transition, and back', async () => {
    const startViewTransition = vi.spyOn(document, 'startViewTransition');
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);
    const playButton = screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` });

    await playButton.click();

    expect(startViewTransition).toHaveBeenLastCalledWith(
      expect.objectContaining({ types: ['video-morph'] }),
    );
    const opening = startViewTransition.mock.results.at(-1);
    assert(opening?.type === 'return');
    await opening.value.ready;
    const stage = screen.getByTitle(VIDEO.title).element().parentElement;
    assert(stage !== null);
    // Both frames carry the name during the morph only: a theme switch never sees it.
    expect(getComputedStyle(stage).viewTransitionName).toMatch(/^_/);
    await opening.value.finished;
    expect(getComputedStyle(stage).viewTransitionName).toBe('none');

    await screen.getByRole('button', { name: 'Fermer la vidéo' }).click();

    expect(startViewTransition).toHaveBeenCalledTimes(2);
    await expect.poll(() => screen.getByRole('dialog').elements()).toHaveLength(0);
  });

  for (const { situation, prepare } of [
    {
      situation: 'when the visitor prefers reduced motion',
      // A query that always matches stands in for `prefers-reduced-motion: reduce`.
      prepare: () =>
        vi.spyOn(window, 'matchMedia').mockReturnValue(window.matchMedia('(min-width: 0px)')),
    },
    {
      situation: 'in a browser without typed view transitions',
      prepare: () => Reflect.deleteProperty(window, 'ViewTransitionTypeSet'),
    },
  ]) {
    it(`opens the player at once ${situation}`, async () => {
      prepare();
      const startViewTransition = vi.spyOn(document, 'startViewTransition');
      const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

      await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

      await expect.element(screen.getByRole('dialog', { name: VIDEO.title })).toBeVisible();
      expect(startViewTransition).not.toHaveBeenCalled();
    });
  }

  it('always offers the video on YouTube, announced as opening a new tab', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);

    const link = screen.getByRole('link', { name: 'Ouvrir la vidéo sur YouTube (nouvel onglet)' });
    await expect
      .element(link)
      .toHaveAttribute('href', 'https://www.youtube.com/watch?v=K_TsQ0Itoek&t=3741s');
    await expect.element(link).toHaveAttribute('target', '_blank');
  });

  it('has no axe violations, closed or open', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} poster={POSTER} />);
    await expectNoAxeViolations(screen.container);

    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    await expectNoAxeViolations(screen.container);
  });
});
