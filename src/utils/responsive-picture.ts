// `import type` (fully erased), not inline `type` specifiers: scripts/generate-images.ts runs
// this file directly in Node, which cannot resolve the `@/` alias.
import type { ImageFormat, ResponsivePicture } from '@/types/responsive-picture';

const MIME_TYPES: Readonly<Record<ImageFormat, string>> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
};

export function buildImageUrl(
  picture: ResponsivePicture,
  width: number,
  format: ImageFormat,
): string {
  return `${picture.basePath}-${String(width)}.${format}`;
}

export function buildSrcSet(picture: ResponsivePicture, format: ImageFormat): string {
  return picture.widths
    .map((width) => `${buildImageUrl(picture, width, format)} ${String(width)}w`)
    .join(', ');
}

export function toImageMimeType(format: ImageFormat): string {
  return MIME_TYPES[format];
}
