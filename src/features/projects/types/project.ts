import { type Period } from '@/types/period';
import { type YouTubeVideo } from '@/types/youtube-video';

export type Project = {
  id: string;
  name: string;
  tagline: string;
  period: Period;
  // **Passages** are those the CV sets in bold.
  context: string;
  stack: readonly string[];
  highlights: readonly string[];
  video?: YouTubeVideo;
};
