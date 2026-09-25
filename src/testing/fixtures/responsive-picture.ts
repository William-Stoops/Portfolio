import type { ResponsivePicture } from '@/types/responsive-picture';

export const TEST_PICTURE = {
  basePath: '/images/test-picture-v1',
  widths: [256, 520],
  formats: ['avif', 'webp', 'jpg'],
  width: 520,
  height: 520,
} as const satisfies ResponsivePicture;
