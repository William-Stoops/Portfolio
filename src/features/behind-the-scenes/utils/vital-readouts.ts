import { type PageVitals, type Vital } from '@/features/behind-the-scenes/types/page-vitals';
import {
  type VitalFormats,
  type VitalsContent,
} from '@/features/behind-the-scenes/types/behind-the-scenes-content';

type VitalKey = keyof PageVitals;

export type VitalReadout = { key: VitalKey; label: string; value: string; threshold?: string };

// The measures in reading order: the paints, what moved, then what was fetched.
const VITAL_KEYS = [
  'firstContentfulPaint',
  'largestContentfulPaint',
  'cumulativeLayoutShift',
  'javascriptBytes',
  'requests',
] as const satisfies readonly VitalKey[];

const FORMAT_OF = {
  firstContentfulPaint: 'milliseconds',
  largestContentfulPaint: 'milliseconds',
  cumulativeLayoutShift: 'score',
  javascriptBytes: 'kilobytes',
  requests: 'count',
} as const satisfies Readonly<Record<VitalKey, keyof VitalFormats>>;

function readValue(vital: Vital, key: VitalKey, content: VitalsContent): string {
  if (vital === 'pending') {
    return content.pending;
  }
  if (vital === 'unsupported') {
    return content.unsupported;
  }
  return content.format[FORMAT_OF[key]](vital);
}

// Each measure as the page shows it, in its language: its name, its value (or why there is
// none yet), and the threshold the CI holds the site to, when there is one.
export function vitalReadouts(vitals: PageVitals, content: VitalsContent): VitalReadout[] {
  return VITAL_KEYS.map((key) => {
    const readout: VitalReadout = {
      key,
      label: content.labels[key],
      value: readValue(vitals[key], key, content),
    };
    const threshold = content.thresholds[key];
    if (threshold !== undefined) {
      readout.threshold = threshold;
    }
    return readout;
  });
}
