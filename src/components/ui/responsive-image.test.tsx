import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ResponsiveImage } from '@/components/ui/responsive-image';
import { TEST_PICTURE } from '@/testing/fixtures/responsive-picture';

describe('ResponsiveImage', () => {
  it('offers modern formats first, then the fallback image', async () => {
    const screen = await render(
      <ResponsiveImage picture={TEST_PICTURE} alt="Portrait" sizes="16rem" loading="lazy" />,
    );

    const sources = [...screen.container.querySelectorAll('source')];
    expect(sources.map((source) => source.type)).toEqual(['image/avif', 'image/webp']);
    expect(sources[0]?.srcset).toBe(
      '/images/test-picture-v1-256.avif 256w, /images/test-picture-v1-520.avif 520w',
    );
    expect(sources.every((source) => source.sizes === '16rem')).toBe(true);
  });

  it('reserves its space with intrinsic dimensions and describes the image', async () => {
    const screen = await render(
      <ResponsiveImage picture={TEST_PICTURE} alt="Portrait" sizes="16rem" loading="lazy" />,
    );

    const image = screen.getByRole('img', { name: 'Portrait' });
    await expect.element(image).toHaveAttribute('width', '520');
    await expect.element(image).toHaveAttribute('height', '520');
    await expect.element(image).toHaveAttribute('src', '/images/test-picture-v1-520.jpg');
  });

  it('loads a critical image eagerly and with high priority', async () => {
    const screen = await render(
      <ResponsiveImage picture={TEST_PICTURE} alt="Portrait" sizes="16rem" loading="critical" />,
    );

    const image = screen.getByRole('img', { name: 'Portrait' });
    await expect.element(image).toHaveAttribute('loading', 'eager');
    await expect.element(image).toHaveAttribute('fetchpriority', 'high');
  });

  it('defers a non-critical image', async () => {
    const screen = await render(
      <ResponsiveImage picture={TEST_PICTURE} alt="Portrait" sizes="16rem" loading="lazy" />,
    );

    const image = screen.getByRole('img', { name: 'Portrait' });
    await expect.element(image).toHaveAttribute('loading', 'lazy');
    await expect.element(image).toHaveAttribute('decoding', 'async');
  });
});
