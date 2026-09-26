import { type KeyFigure } from '@/components/ui/key-figures';

export type HeroContent = {
  greeting: string;
  role: string;
  tagline: string;
  technologies: readonly string[];
  // Three facts that sum up the profile under the calls to action: a strong value, a caption.
  highlights: readonly KeyFigure[];
  portraitAlt: string;
};
