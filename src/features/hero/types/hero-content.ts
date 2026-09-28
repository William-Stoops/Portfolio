import { type KeyFigure } from '@/components/ui/key-figures';

type HeroLink = { label: string; href: string };

export type HeroContent = {
  greeting: string;
  role: string;
  tagline: string;
  contact: HeroLink;
  // The CV exists in one language: `details` says which, with its format and weight.
  cv: HeroLink & { details: string };
  technologies: readonly string[];
  // Three facts that sum up the profile under the calls to action: a strong value, a caption.
  highlights: readonly KeyFigure[];
  portraitAlt: string;
  labels: {
    highlights: string;
    technologies: string;
    stack: string;
    pauseBand: string;
    resumeBand: string;
  };
};
