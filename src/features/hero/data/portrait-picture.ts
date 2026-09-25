// Type-only import: scripts/generate-images.ts runs this file directly in Node, which
// cannot resolve the `@/` alias at runtime.
import type { ResponsivePicture } from '@/types/responsive-picture';

// Generated from docs/content/images/william-stoops-portrait.jpg (520 × 520 crop).
export const PORTRAIT_PICTURE = {
  basePath: '/images/william-stoops-portrait-v1',
  widths: [256, 384, 520],
  formats: ['avif', 'webp', 'jpg'],
  width: 520,
  height: 520,
} as const satisfies ResponsivePicture;
