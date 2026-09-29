import { describe, expect, it } from 'vitest';

import { LAND_DOTS } from '@/features/korea/data/land-dots';
import { buildDotGrid, decodeLandMask } from '@/features/korea/utils/land-dots';

const DOTS = buildDotGrid(LAND_DOTS);
const LAND = decodeLandMask(LAND_DOTS.mask, LAND_DOTS.count);

// Whether the dot nearest to a place is land: the mask read back as the globe reads it.
function isLandNear(latitude: number, longitude: number): boolean {
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;
  DOTS.forEach((dot, index) => {
    const distance =
      (dot.latitude - latitude) ** 2 +
      ((dot.longitude - longitude) * Math.cos((latitude * Math.PI) / 180)) ** 2;
    if (distance < nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  });
  return LAND[nearest] ?? false;
}

describe('land dots', () => {
  it('describes one grid, dot for dot', () => {
    expect(DOTS).toHaveLength(LAND_DOTS.count);
  });

  it.each([
    ['Paris', 48.86, 2.35],
    ['Seoul', 37.57, 126.98],
    ['Moscow', 55.76, 37.62],
  ])('puts %s on land', (_, latitude, longitude) => {
    expect(isLandNear(latitude, longitude)).toBe(true);
  });

  it.each([
    ['the middle of the Atlantic', 30, -40],
    ['the Pacific', 0, -150],
    ['the Sea of Japan', 40, 135],
  ])('leaves %s as sea', (_, latitude, longitude) => {
    expect(isLandNear(latitude, longitude)).toBe(false);
  });

  it('covers about three tenths of the sphere with land, as the Earth does', () => {
    const share = LAND.filter(Boolean).length / LAND.length;

    expect(share).toBeGreaterThan(0.25);
    expect(share).toBeLessThan(0.35);
  });
});
