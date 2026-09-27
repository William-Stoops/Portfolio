type AboutAxis = { title: string; description: string };

// A decorative drawing of the figure, computed from its own numbers.
type MetricVisual =
  // A bar shrinking to what remains after the gain.
  | { kind: 'reduction'; remainingShare: number }
  // One block per unit (years).
  | { kind: 'steps'; count: number }
  // A podium with the first place lit.
  | { kind: 'podium' };

type AboutMetric = {
  // As displayed, with symbols and the typography of the page's language.
  value: string;
  // What a screen reader should say instead, when symbols would be read badly.
  spokenValue?: string;
  label: string;
  visual: MetricVisual;
};

export type AboutContent = {
  // Anchor of the section, in the page's language.
  id: string;
  title: string;
  profile: string;
  axes: readonly AboutAxis[];
  metrics: readonly AboutMetric[];
  labels: { axes: string; figures: string };
};
