import { describe, expect, it } from 'vitest';

import { buildYouTubeEmbedUrl, buildYouTubeWatchUrl } from '@/utils/youtube';

const VIDEO = { youtubeId: 'K_TsQ0Itoek', startSeconds: 3741 };

describe('YouTube URLs', () => {
  it('embeds from the privacy-enhanced domain, at the start time, playing on activation', () => {
    expect(buildYouTubeEmbedUrl(VIDEO)).toBe(
      'https://www.youtube-nocookie.com/embed/K_TsQ0Itoek?start=3741&autoplay=1',
    );
  });

  it('links to the watch page at the same start time', () => {
    expect(buildYouTubeWatchUrl(VIDEO)).toBe('https://www.youtube.com/watch?v=K_TsQ0Itoek&t=3741s');
  });
});
