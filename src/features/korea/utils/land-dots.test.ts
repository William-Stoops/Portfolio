import { describe, expect, it } from 'vitest';

import {
  buildDotGrid,
  decodeLandMask,
  encodeLandMask,
  landPoints,
} from '@/features/korea/utils/land-dots';

describe('buildDotGrid', () => {
  it('spaces the dots evenly over the sphere: fewer per row towards the poles', () => {
    const grid = buildDotGrid({ rowStep: 10, minLatitude: 0, maxLatitude: 60 });
    const rowSizes = new Map<number, number>();
    for (const { latitude } of grid) {
      rowSizes.set(latitude, (rowSizes.get(latitude) ?? 0) + 1);
    }

    expect([...rowSizes.keys()]).toEqual([0, 10, 20, 30, 40, 50, 60]);
    expect(rowSizes.get(0)).toBe(36);
    expect(rowSizes.get(60)).toBe(18);
  });

  it('places each row’s dots across all longitudes, half a step from the antimeridian', () => {
    const equator = buildDotGrid({ rowStep: 90, minLatitude: 0, maxLatitude: 0 });

    expect(equator.map(({ longitude }) => longitude)).toEqual([-135, -45, 45, 135]);
  });
});

describe('land mask', () => {
  it('encodes one bit per dot and reads it back', () => {
    const land = [true, false, false, true, true, false, true, false, true, true, false];

    expect(decodeLandMask(encodeLandMask(land), land.length)).toEqual(land);
  });
});

describe('landPoints', () => {
  it('keeps the dots of the grid that fall on land, in order', () => {
    const grid = { rowStep: 90, minLatitude: 0, maxLatitude: 0 };
    const mask = encodeLandMask([false, true, false, true]);

    expect(landPoints({ ...grid, count: 4, mask })).toEqual([
      { latitude: 0, longitude: -45 },
      { latitude: 0, longitude: 135 },
    ]);
  });
});
