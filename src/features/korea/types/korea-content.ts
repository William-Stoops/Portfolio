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

// A word in Korean, and what it means in the page's language.
type KoreanWord = { korean: string; translation: string };

// A greeting in the page's language, or in another one (then with `lang` and a translation).
export type Greeting = { text: string; lang?: string; translation?: string };

export type KoreaContent = {
  greeting: KoreanWord;
  lead: string;
  route: KoreaRoute;
  // The way home: a goodbye to Seoul, then hello to France, in French.
  homecoming: { farewell: KoreanWord; greeting: Greeting };
  university: { korean: string; name: string };
  figures: readonly KeyFigure[];
  models: readonly { name: string; detail: string }[];
  // The kinetic band: a line in Korean, and its translation drifting the other way.
  band: { korean: readonly string[]; translation: readonly string[] };
  photos: readonly KoreaPhoto[];
  labels: { yearFigures: string; models: string; modelsList: string };
};
