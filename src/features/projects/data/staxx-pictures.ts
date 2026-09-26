// Type-only import: scripts/generate-images.ts runs this file directly in Node, which
// cannot resolve the `@/` alias at runtime.
import type { ResponsivePicture } from '@/types/responsive-picture';

// Generated from docs/content/images/staxx-*.jpg, from William's originals (the NRJ
// explanation photo only exists at 800 px wide).

// The frame the pitch video opens on, at 1:02:21, captured at 1920 × 1080: 16:9, like the
// player it grows into.
export const PITCH_PICTURE = {
  basePath: '/images/staxx-pitch-v1',
  widths: [640, 960, 1280, 1920],
  formats: ['avif', 'webp', 'jpg'],
  width: 1920,
  height: 1080,
} as const satisfies ResponsivePicture;

export const SUMMIT_PICTURE = {
  basePath: '/images/staxx-epitech-summit-v2',
  widths: [640, 960, 1290],
  formats: ['avif', 'webp', 'jpg'],
  width: 1290,
  height: 1232,
} as const satisfies ResponsivePicture;

export const NRJ_INTERVIEW_PICTURE = {
  basePath: '/images/staxx-nrj-lille-interview-v2',
  widths: [480, 800, 1200],
  formats: ['avif', 'webp', 'jpg'],
  width: 1600,
  height: 2133,
} as const satisfies ResponsivePicture;

export const NRJ_EXPLANATION_PICTURE = {
  basePath: '/images/staxx-nrj-lille-explanation-v1',
  widths: [400, 800],
  formats: ['avif', 'webp', 'jpg'],
  width: 800,
  height: 904,
} as const satisfies ResponsivePicture;
