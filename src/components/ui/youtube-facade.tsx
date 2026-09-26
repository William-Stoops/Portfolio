import { ExternalLink, Play, X } from 'lucide-react';
import { type ReactNode, useId } from 'react';

import { useFullscreenDialog } from '@/hooks/use-fullscreen-dialog';

import { type YouTubeVideo } from '@/types/youtube-video';
import { buildYouTubeEmbedUrl, buildYouTubeWatchUrl } from '@/utils/youtube';

type YouTubeFacadeProps = {
  video: YouTubeVideo;
  // Drawn behind the play button, like a poster: decoration, hidden from assistive tech.
  backdrop?: ReactNode;
};

// A YouTube iframe costs ~500 kB and third-party requests before anyone presses play. This
// button stands in for it and mounts the privacy-enhanced player only on demand, in a
// dialog that takes the whole screen.
export function YouTubeFacade({ video, backdrop }: YouTubeFacadeProps) {
  const { isOpen, dialogRef, stageRef, open, close, handleClose } = useFullscreenDialog();
  const titleId = `${useId()}-titre`;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={open}
        data-cursor="Lire"
        data-pointer
        className="group relative isolate flex aspect-video w-full pointer-tilt flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border border-border bg-surface-raised p-6 text-center"
      >
        {backdrop === undefined ? null : (
          <span aria-hidden="true" className="absolute inset-0 -z-10">
            {backdrop}
          </span>
        )}
        {/* The ring ripples out once per hover: no loop. */}
        <span className="relative inline-grid size-16 place-items-center rounded-full bg-accent text-on-accent transition-[background-color,scale] duration-250 ease-out group-hover:scale-110 group-hover:bg-accent-hover">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-accent transition-[scale,opacity] duration-450 ease-out group-hover:scale-175 group-hover:opacity-0"
          />
          <Play
            aria-hidden="true"
            focusable="false"
            className="size-7 translate-x-0.5"
            strokeWidth={1.75}
          />
        </span>
        <span className="rounded-md bg-surface-raised px-3 py-1 font-semibold">
          <span className="sr-only">Lire la vidéo : </span>
          {video.title}
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
        onClose={handleClose}
        className="m-0 size-full max-h-none max-w-none bg-canvas p-0 text-fg scheme-dark"
      >
        <div ref={stageRef} className="flex size-full flex-col bg-canvas">
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
          {/* A size container: the player takes the largest 16:9 box that fits. */}
          <div className="[container-type:size] grid min-h-0 flex-1 place-items-center px-gutter pb-gutter">
            {/*
              Mounted only while open: nothing loads before the click, and closing stops the
              video. The focus stays on the close button, not on the player: keys pressed in
              the cross-origin player never reach the page, so Escape would stop closing the
              dialog. One Tab reaches the player.
            */}
            {isOpen ? (
              <iframe
                src={buildYouTubeEmbedUrl(video)}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                // Only what the player needs: its scripts on its own origin, fullscreen, and
                // the "watch on YouTube" link it opens in a new tab.
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allowFullScreen
                className="aspect-video w-[min(100cqw,calc(100cqh*16/9))] rounded-md"
              />
            ) : null}
          </div>
        </div>
      </dialog>
    </div>
  );
}
