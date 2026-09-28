import { type KeyFigure } from '@/components/ui/key-figures';
import { type ResponsivePicture } from '@/types/responsive-picture';

type KoreaPhoto = {
  picture: ResponsivePicture;
  alt: string;
  // One Korean word set above the caption, which says what the photo shows.
  korean: string;
  caption: string;
};

// A place on the route, with its Korean name when it has one.
type Place = { name: string; korean?: string };

export type KoreaRoute = { origin: Place; destination: Place };

export type KoreaContent = {
  greeting: { korean: string; french: string };
  lead: string;
  route: KoreaRoute;
  // The way home: a goodbye to Seoul, then hello to France in the site's own word.
  homecoming: { farewell: { korean: string; french: string }; greeting: string };
  university: { korean: string; name: string };
  figures: readonly KeyFigure[];
  models: readonly { name: string; detail: string }[];
  // The kinetic band: a line in Korean, and its translation drifting the other way.
  band: { korean: readonly string[]; translation: readonly string[] };
  photos: readonly KoreaPhoto[];
};
