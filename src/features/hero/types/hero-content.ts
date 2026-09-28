// The hero (ADR 0037): what William does in one sentence of his CV, the two ways to act on
// it, his photo, and one proof with its figure.
export type HeroContent = {
  eyebrow: string;
  // Read before the headline by assistive tech only: whose sentence it is.
  ownerPrefix: string;
  headline: string;
  lead: string;
  // The CV's format and weight complete its link's name.
  actions: { contact: string; downloadCv: string; cvDetails: string };
  // The IT-Finance rework, the figure a stranger reads at once, and the way to its story.
  proof: { context: string; before: string; after: string; link: string };
  keywordsLabel: string;
  keywords: readonly string[];
  portraitAlt: string;
};
