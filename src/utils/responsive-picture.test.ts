import { describe, expect, it } from 'vitest';

import { TEST_PICTURE } from '@/testing/fixtures/responsive-picture';
import { buildImageUrl, buildSrcSet, toImageMimeType } from '@/utils/responsive-picture';

describe('responsive picture helpers', () => {
  it('builds a file URL from the base path, width and format', () => {
    expect(buildImageUrl(TEST_PICTURE, 256, 'avif')).toBe('/images/test-picture-v1-256.avif');
  });

  it('lists every width of a format in a srcset', () => {
    expect(buildSrcSet(TEST_PICTURE, 'webp')).toBe(
      '/images/test-picture-v1-256.webp 256w, /images/test-picture-v1-520.webp 520w',
    );
  });

  it('maps file formats to MIME types', () => {
    expect(toImageMimeType('avif')).toBe('image/avif');
    expect(toImageMimeType('webp')).toBe('image/webp');
    expect(toImageMimeType('jpg')).toBe('image/jpeg');
  });
});
