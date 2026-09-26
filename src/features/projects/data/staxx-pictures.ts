// Type-only import: scripts/generate-images.ts runs this file directly in Node, which
// cannot resolve the `@/` alias at runtime.
import type { ResponsivePicture } from '@/types/responsive-picture';

// Generated from docs/content/images/staxx-*.jpg, provided by William at 800 px wide.

export const SUMMIT_PICTURE = {
  basePath: '/images/staxx-epitech-summit-v1',
  widths: [480, 800],
  formats: ['avif', 'webp', 'jpg'],
  width: 800,
  height: 764,
} as const satisfies ResponsivePicture;

export const NRJ_INTERVIEW_PICTURE = {
  basePath: '/images/staxx-nrj-lille-interview-v1',
  widths: [400, 800],
  formats: ['avif', 'webp', 'jpg'],
  width: 800,
  height: 800,
} as const satisfies ResponsivePicture;

export const NRJ_EXPLANATION_PICTURE = {
  basePath: '/images/staxx-nrj-lille-explanation-v1',
  widths: [400, 800],
  formats: ['avif', 'webp', 'jpg'],
  width: 800,
  height: 904,
} as const satisfies ResponsivePicture;
