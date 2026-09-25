import { type YouTubeVideo } from '@/types/youtube-video';

type VideoReference = Pick<YouTubeVideo, 'youtubeId' | 'startSeconds'>;

// youtube-nocookie: no tracking cookie is set before the visitor plays the video.
export function buildYouTubeEmbedUrl({ youtubeId, startSeconds }: VideoReference): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${String(startSeconds)}&autoplay=1`;
}

export function buildYouTubeWatchUrl({ youtubeId, startSeconds }: VideoReference): string {
  return `https://www.youtube.com/watch?v=${youtubeId}&t=${String(startSeconds)}s`;
}
