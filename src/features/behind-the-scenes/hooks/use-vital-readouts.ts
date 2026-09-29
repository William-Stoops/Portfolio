import { usePageVitals } from '@/features/behind-the-scenes/hooks/use-page-vitals';
import { type VitalsContent } from '@/features/behind-the-scenes/types/behind-the-scenes-content';
import {
  type VitalReadout,
  vitalReadouts,
} from '@/features/behind-the-scenes/utils/vital-readouts';

// The measures of this visit, read in the page's language.
export function useVitalReadouts(content: VitalsContent): VitalReadout[] {
  return vitalReadouts(usePageVitals(), content);
}
