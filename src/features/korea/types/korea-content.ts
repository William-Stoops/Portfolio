import { type KeyFigure } from '@/components/ui/key-figures';
import { type ResponsivePicture } from '@/types/responsive-picture';

type KoreaPhoto = {
  picture: ResponsivePicture;
  alt: string;
  // One Korean word set above the caption, which says what the photo shows.
  korean: string;
  caption: string;
};

export type KoreaContent = {
  greeting: { korean: string; french: string };
  lead: string;
  route: { from: string; to: { korean: string; french: string } };
  university: { korean: string; name: string };
  figures: readonly KeyFigure[];
  models: readonly { name: string; detail: string }[];
  // The kinetic band: a line in Korean, and its translation drifting the other way.
  band: { korean: readonly string[]; translation: readonly string[] };
  photos: readonly KoreaPhoto[];
};
