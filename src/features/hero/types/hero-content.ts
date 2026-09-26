export type HeroContent = {
  greeting: string;
  role: string;
  tagline: string;
  technologies: readonly string[];
  // Short facts pinned around the portrait, like stickers: decoration, repeated elsewhere.
  stickers: readonly string[];
  portraitAlt: string;
};
