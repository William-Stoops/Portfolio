import { type KeyFigure } from '@/components/ui/key-figures';
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
  // The project in three figures, opening its case study.
  figures: readonly KeyFigure[];
  video?: YouTubeVideo;
};
