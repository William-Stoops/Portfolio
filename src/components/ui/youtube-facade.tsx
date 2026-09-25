import { ExternalLink, Play } from 'lucide-react';
import { useState } from 'react';

import { type YouTubeVideo } from '@/types/youtube-video';
import { buildYouTubeEmbedUrl, buildYouTubeWatchUrl } from '@/utils/youtube';

type YouTubeFacadeProps = { video: YouTubeVideo };

// A YouTube iframe costs ~500 kB and third-party requests before anyone presses play. This
// button stands in for it and mounts the privacy-enhanced player only on demand.
export function YouTubeFacade({ video }: YouTubeFacadeProps) {
  const [isPlayerMounted, setIsPlayerMounted] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {isPlayerMounted ? (
        <iframe
          // The button that had focus disappears: hand focus to its replacement.
          ref={(player) => {
            player?.focus();
          }}
          src={buildYouTubeEmbedUrl(video)}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          // Only what the player needs: its scripts on its own origin, fullscreen, and
          // the "watch on YouTube" link it opens in a new tab.
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          allowFullScreen
          className="aspect-video w-full rounded-lg border border-border"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsPlayerMounted(true);
          }}
          className="group flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface-raised p-6 text-center"
        >
          <span className="inline-grid size-16 place-items-center rounded-full bg-accent text-on-accent transition-colors duration-150 group-hover:bg-accent-hover">
            <Play
              aria-hidden="true"
              focusable="false"
              className="size-7 translate-x-0.5"
              strokeWidth={1.75}
            />
          </span>
          <span className="font-semibold">
            <span className="sr-only">Lire la vidéo : </span>
            {video.title}
          </span>
        </button>
      )}
      <a
        href={buildYouTubeWatchUrl(video)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-6 items-center gap-1 self-start text-small"
      >
        Ouvrir la vidéo sur YouTube
        <span className="sr-only"> (nouvel onglet)</span>
        <ExternalLink aria-hidden="true" focusable="false" className="size-4" strokeWidth={1.75} />
      </a>
    </div>
  );
}
