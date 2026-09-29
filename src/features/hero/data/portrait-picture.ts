// Type-only import: scripts/generate-images.ts runs this file directly in Node, which
// cannot resolve the `@/` alias at runtime.
import type { ResponsivePicture } from '@/types/responsive-picture';

// Generated from docs/content/images/william-stoops-portrait.jpg: the portrait William gave
// on 2026-09-28, 1254 × 1254, framed in a card of the hero (ADR 0037).
export const PORTRAIT_PICTURE = {
  basePath: '/images/william-stoops-portrait-v2',
  widths: [480, 800, 1254],
  formats: ['avif', 'webp', 'jpg'],
  width: 1254,
  height: 1254,
} as const satisfies ResponsivePicture;
