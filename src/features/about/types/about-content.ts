type AboutAxis = { title: string; description: string };

type AboutMetric = {
  // As displayed, with symbols and French typographic spaces.
  value: string;
  // What a screen reader should say instead, when symbols would be read badly.
  spokenValue?: string;
  label: string;
};

export type AboutContent = {
  profile: string;
  axes: readonly AboutAxis[];
  metrics: readonly AboutMetric[];
};
