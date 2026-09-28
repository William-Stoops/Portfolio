// Type-only import: scripts/generate-images.ts runs this file directly in Node, which
// cannot resolve the `@/` alias at runtime.
import type { ResponsivePicture } from '@/types/responsive-picture';

// Generated from docs/content/images/korea-*.jpg (William's photos, 1500 × 2000).
const KOREA_PHOTO_FORMAT = {
  widths: [400, 800, 1200],
  formats: ['avif', 'webp', 'jpg'],
  width: 1500,
  height: 2000,
} as const;

export const BASEBALL_STADIUM_PICTURE = {
  basePath: '/images/korea-baseball-stadium-v1',
  ...KOREA_PHOTO_FORMAT,
} as const satisfies ResponsivePicture;

export const HANOK_CAFE_PICTURE = {
  basePath: '/images/korea-hanok-cafe-v1',
  ...KOREA_PHOTO_FORMAT,
} as const satisfies ResponsivePicture;

export const NIGHT_PAVILION_PICTURE = {
  basePath: '/images/korea-night-pavilion-v1',
  ...KOREA_PHOTO_FORMAT,
} as const satisfies ResponsivePicture;
