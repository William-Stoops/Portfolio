import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { expectNoAxeViolations } from '@/testing/expect-no-axe-violations';

const VIDEO = {
  youtubeId: 'K_TsQ0Itoek',
  startSeconds: 3741,
  title: 'Pitch de STAXX au concours Epitech Summit',
};

describe('YouTubeFacade', () => {
  it('loads nothing from YouTube until the visitor asks for the video', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    expect(screen.container.querySelector('iframe')).toBeNull();
    await expect
      .element(screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }))
      .toBeVisible();
  });

  it('replaces itself with the privacy-enhanced player, focused, at the start time', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    await screen.getByRole('button', { name: `Lire la vidéo : ${VIDEO.title}` }).click();

    const player = screen.getByTitle(VIDEO.title);
    await expect
      .element(player)
      .toHaveAttribute(
        'src',
        'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
      );
    await expect.element(player).toHaveFocus();
    await expect
      .element(player)
      .toHaveAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-presentation allow-popups',
      );
  });

  it('always offers the video on YouTube, announced as opening a new tab', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    const link = screen.getByRole('link', { name: 'Ouvrir la vidéo sur YouTube (nouvel onglet)' });
    await expect
      .element(link)
      .toHaveAttribute('href', 'https://www.youtube.com/watch?v=K_TsQ0Itoek&t=3741s');
    await expect.element(link).toHaveAttribute('target', '_blank');
  });

  it('has no axe violations', async () => {
    const screen = await render(<YouTubeFacade video={VIDEO} />);

    await expectNoAxeViolations(screen.container);
  });
});
