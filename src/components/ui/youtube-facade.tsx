import { ExternalLink, Play, X } from 'lucide-react';
import { useId } from 'react';

import { ResponsiveImage } from '@/components/ui/responsive-image';
import { useVideoDialog } from '@/hooks/use-video-dialog';
import { cn } from '@/lib/cn';
import { type ResponsivePicture } from '@/types/responsive-picture';
import { type YouTubeVideo } from '@/types/youtube-video';
import { buildYouTubeEmbedUrl, buildYouTubeWatchUrl } from '@/utils/youtube';

type YouTubeFacadeProps = {
  video: YouTubeVideo;
  // The frame the video opens on, in 16:9 like the player: behind the play button, then
  // in the player's place while it loads. Decoration, hidden from assistive tech.
  poster: { picture: ResponsivePicture; sizes: string };
};

// A YouTube iframe costs ~500 kB and third-party requests before anyone presses play. This
// button stands in for it, on the video's own first frame served by the site, and mounts
// the privacy-enhanced player only on demand: the poster grows into a dialog covering the
// screen, and the player appears over it once loaded.
export function YouTubeFacade({ video, poster }: YouTubeFacadeProps) {
  const {
    isOpen,
    isPlayerReady,
    posterRef,
    dialogRef,
    stageRef,
    posterMorphName,
    stageMorphName,
    open,
    close,
    handleCancel,
    handleClose,
    handlePlayerLoad,
  } = useVideoDialog();
  const titleId = `${useId()}-titre`;

  return (
    <div className="flex flex-col gap-3">
      <button
        ref={posterRef}
        type="button"
        onClick={open}
        data-pointer
        style={{ '--morph-name': posterMorphName }}
        className="group @container relative isolate block aspect-video w-full overflow-clip rounded-lg bg-surface-raised text-start poster-timeline video-morph-frame"
      >
        {/* The frame settles while letterbox bars draw back: the film opens as it arrives. */}
        <span aria-hidden="true" className="absolute inset-0 -z-10 poster-settle">
          <ResponsiveImage
            picture={poster.picture}
            alt=""
            sizes={poster.sizes}
            loading="lazy"
            className="size-full object-cover transition-[scale] duration-450 ease-out group-hover:scale-103"
          />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[12%] origin-top letterbox-bar bg-canvas"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[12%] origin-bottom letterbox-bar bg-canvas"
        />
        <span className="absolute inset-0 grid place-items-center">
          {/* Drawn a little towards the pointer across the whole frame. */}
          <span className="pointer-magnet [--magnet-reach:1.5rem]">
            {/* The ring ripples out once per hover: no loop. */}
            <span className="relative inline-grid size-16 place-items-center rounded-full bg-accent text-on-accent transition-[background-color,scale] duration-250 ease-out group-hover:scale-110 group-hover:bg-accent-hover @xl:size-20">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-accent transition-[scale,opacity] duration-450 ease-out group-hover:scale-175 group-hover:opacity-0"
              />
              <Play
                aria-hidden="true"
                focusable="false"
                className="size-7 translate-x-0.5 @xl:size-9"
                strokeWidth={1.75}
              />
            </span>
          </span>
        </span>
        <span className="sr-only">Lire la vidéo : {video.title}</span>
        {/*
          Cut into the frame on the page's own background, like the photos' captions: its
          contrast never depends on the picture. A small frame keeps its picture and its play
          button: the figure's caption already says what the video is.
        */}
        <span
          aria-hidden="true"
          className="absolute start-0 bottom-0 hidden max-w-[85%] flex-col gap-1 rounded-se-lg bg-canvas pe-5 pt-3 @md:flex @xl:pe-8 @xl:pt-4"
        >
          <span className="text-small font-semibold tracking-[0.2em] text-accent-fg uppercase">
            Lire la vidéo
          </span>
          <span className="font-semibold text-balance">{video.title}</span>
        </span>
      </button>
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
      {/*
        Dark in both themes: a video reads best on a dark surround. Forcing the colour scheme
        resolves every light-dark() token to its dark value, so contrast stays checked.
      */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={handleCancel}
        onClose={handleClose}
        className="m-0 size-full max-h-none max-w-none bg-canvas p-0 text-fg scheme-dark"
      >
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between gap-4 px-gutter py-2">
            <h2 id={titleId} className="font-semibold">
              {video.title}
            </h2>
            {/* First focusable element: showModal() moves the focus here. */}
            <button
              type="button"
              onClick={close}
              className="inline-grid size-11 shrink-0 place-items-center rounded-md hover:bg-surface-raised"
            >
              <X aria-hidden="true" focusable="false" className="size-6" strokeWidth={1.75} />
              <span className="sr-only">Fermer la vidéo</span>
            </button>
          </div>
          {/* A size container: the stage takes the largest 16:9 box that fits. */}
          <div className="[container-type:size] grid min-h-0 flex-1 place-items-center px-gutter pb-gutter">
            <div
              ref={stageRef}
              style={{ '--morph-name': stageMorphName }}
              className="relative aspect-video w-[min(100cqw,calc(100cqh*16/9))] overflow-clip rounded-md bg-surface-raised video-morph-frame"
            >
              {/*
                Mounted only while open: nothing loads before the click, and closing stops the
                video. The poster is the file the button already shows, so it is there at once
                for the morph to grow into. The focus stays on the close button, not on the
                player: keys pressed in the cross-origin player never reach the page, so
                Escape would stop closing the dialog. One Tab reaches the player.
              */}
              {isOpen ? (
                <>
                  <span aria-hidden="true" className="absolute inset-0">
                    <ResponsiveImage
                      picture={poster.picture}
                      alt=""
                      sizes={poster.sizes}
                      loading="critical"
                      className="size-full object-cover"
                    />
                  </span>
                  <iframe
                    src={buildYouTubeEmbedUrl(video)}
                    title={video.title}
                    onLoad={handlePlayerLoad}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    // Only what the player needs: its scripts on its own origin, fullscreen,
                    // and the "watch on YouTube" link it opens in a new tab.
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                    className={cn(
                      'absolute inset-0 size-full transition-opacity duration-450 ease-out',
                      isPlayerReady ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
