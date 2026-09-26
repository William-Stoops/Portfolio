import { type KeyFigure } from '@/components/ui/key-figures';
import { type Period } from '@/types/period';
import { type ResponsivePicture } from '@/types/responsive-picture';
import { type YouTubeVideo } from '@/types/youtube-video';

type ProjectPhoto = { picture: ResponsivePicture; alt: string };

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
  // The pitch, filmed: the video, with the frame it opens on as its poster (16:9).
  pitch?: { video: YouTubeVideo; poster: ResponsivePicture; label: string; caption: string };
  // A photo of the project's defining moment, captioned by where it was taken.
  photo?: ProjectPhoto & { place: string; caption: string };
  // Where the project was talked about, with the photos of that moment.
  press?: { label: string; outlet: string; summary: string; photos: readonly ProjectPhoto[] };
};
