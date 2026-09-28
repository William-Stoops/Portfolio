import { type PageVitals } from '@/features/behind-the-scenes/types/page-vitals';

type VitalKey = keyof PageVitals;

// How each measure reads, in the page's language.
export type VitalFormats = {
  milliseconds: (value: number) => string;
  score: (value: number) => string;
  kilobytes: (bytes: number) => string;
  count: (value: number) => string;
};

export type VitalsContent = {
  title: string;
  intro: string;
  labels: Readonly<Record<VitalKey, string>>;
  // Under a measure, the threshold the CI holds the site to, when there is one.
  thresholds: Readonly<Partial<Record<VitalKey, string>>>;
  pending: string;
  unsupported: string;
  format: VitalFormats;
};

type Gate = { title: string; text: string };

// The page about how the site is made (ADR 0033), in the page's language.
export type BehindTheScenesContent = {
  title: string;
  description: string;
  intro: string;
  repository: string;
  newTab: string;
  vitals: VitalsContent;
  gates: { title: string; intro: string; items: readonly Gate[] };
  decisions: { title: string; text: string; highlights: readonly string[]; link: string };
};
