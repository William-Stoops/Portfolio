import { Play } from 'lucide-react';

import { ResponsiveImage } from '@/components/ui/responsive-image';
import { useInlinePlayer } from '@/hooks/use-inline-player';
import { useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { type ResponsivePicture } from '@/types/responsive-picture';
import { type YouTubeVideo } from '@/types/youtube-video';
import { buildYouTubeEmbedUrl } from '@/utils/youtube';

type FacadeMessages = {
  play: string;
  // The button's accessible name: its visible text, then the video's title.
  playTitled: (title: string) => string;
};

const FACADE_MESSAGES: Localized<FacadeMessages> = {
  fr: { play: 'Lire la vidéo', playTitled: (title) => `Lire la vidéo : ${title}` },
  en: { play: 'Play the video', playTitled: (title) => `Play the video: ${title}` },
};

type YouTubeFacadeProps = {
  video: YouTubeVideo;
  // The frame the video opens on, in 16:9 like the player: behind the play button, then
  // under the player while it loads. Decoration, hidden from assistive tech.
  poster: { picture: ResponsivePicture; sizes: string };
};

// A YouTube iframe costs ~500 kB and third-party requests before anyone presses play. This
// button stands in for it, on the video's own first frame served by the site, and mounts
// the privacy-enhanced player only on demand, right where the poster was: the video plays
// in the page, in its 16:9 frame.
export function YouTubeFacade({ video, poster }: YouTubeFacadeProps) {
  const { isPlaying, play, playerRef } = useInlinePlayer();
  const messages = useLocalized(FACADE_MESSAGES);

  return (
    <div className="@container relative isolate aspect-video w-full overflow-clip rounded-lg bg-surface-raised">
      {isPlaying ? (
        <>
          {/* The file the button showed, there at once while the player loads over it. */}
          <span aria-hidden="true" className="absolute inset-0 -z-10">
            <ResponsiveImage
              picture={poster.picture}
              alt=""
              sizes={poster.sizes}
              loading="lazy"
              className="size-full object-cover"
            />
          </span>
          <iframe
            ref={playerRef}
            src={buildYouTubeEmbedUrl(video)}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            // Only what the player needs: its scripts on its own origin, fullscreen, and the
            // "watch on YouTube" link it opens in a new tab.
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            className="absolute inset-0 size-full"
          />
        </>
      ) : (
        <button type="button" onClick={play} className="group absolute inset-0 block text-start">
          <span aria-hidden="true" className="absolute inset-0 -z-10">
            <ResponsiveImage
              picture={poster.picture}
              alt=""
              sizes={poster.sizes}
              loading="lazy"
              className="size-full object-cover transition-[scale] duration-450 ease-out group-hover:scale-103"
            />
          </span>
          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-grid size-16 place-items-center rounded-full bg-accent text-on-accent transition-[background-color,scale] duration-250 ease-out group-hover:scale-105 group-hover:bg-accent-hover @xl:size-20">
              <Play
                aria-hidden="true"
                focusable="false"
                className="size-7 translate-x-0.5 @xl:size-9"
                strokeWidth={1.75}
              />
            </span>
          </span>
          <span className="sr-only">{messages.playTitled(video.title)}</span>
          {/*
            Cut into the frame on the page's own background, like the photos' captions: its
            contrast never depends on the picture. A small frame keeps its picture and its
            play button: the figure's caption already says what the video is.
          */}
          <span
            aria-hidden="true"
            className="absolute start-0 bottom-0 hidden max-w-[85%] flex-col gap-1 rounded-se-lg bg-canvas pe-5 pt-3 @md:flex @xl:pe-8 @xl:pt-4"
          >
            <span className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
              {messages.play}
            </span>
            <span className="font-semibold text-balance">{video.title}</span>
          </span>
        </button>
      )}
    </div>
  );
}
