import { type GeoPoint } from '@/features/korea/types/geo-point';

// Where the flights of the voyage start and land on the globe: Paris for France (the
// flights to Seoul leave from there), and Seoul.
export const FLIGHT_PLACES = {
  france: { latitude: 48.86, longitude: 2.35 },
  seoul: { latitude: 37.57, longitude: 126.98 },
} as const satisfies Record<string, GeoPoint>;
