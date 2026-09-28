type AboutAxis = { title: string; description: string };

export type AboutContent = {
  // Anchor of the section, in the page's language.
  id: string;
  title: string;
  profile: string;
  axes: readonly AboutAxis[];
  labels: { axes: string };
};
