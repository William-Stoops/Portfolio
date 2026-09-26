import { describe, expect, it } from 'vitest';

import {
  buildSurfaceGrid,
  buildWireframeIndices,
  invertMatrix,
  lookAt,
  multiplyMatrices,
  perspective,
  unprojectToGround,
} from '@/features/hero/utils/surface-math';

// Projects a world point to the screen, independently of the module under test.
function project(matrix: Float32Array, [x, y, z]: readonly [number, number, number]) {
  const row = (index: number) =>
    (matrix[index] ?? 0) * x +
    (matrix[4 + index] ?? 0) * y +
    (matrix[8 + index] ?? 0) * z +
    (matrix[12 + index] ?? 0);
  return [row(0) / row(3), row(1) / row(3)] as const;
}

describe('buildSurfaceGrid', () => {
  it('lays columns × rows points evenly from -1 to 1 on both axes', () => {
    const grid = buildSurfaceGrid(3, 2);

    expect([...grid]).toEqual([-1, -1, 0, -1, 1, -1, -1, 1, 0, 1, 1, 1]);
  });
});

describe('buildWireframeIndices', () => {
  it('links each point to its right and lower neighbours, once', () => {
    // 2 × 2 grid: points 0 1 / 2 3.
    expect([...buildWireframeIndices(2, 2)]).toEqual([0, 1, 2, 3, 0, 2, 1, 3]);
  });

  it('draws rows*(columns-1) + columns*(rows-1) segments', () => {
    expect(buildWireframeIndices(72, 40)).toHaveLength((40 * 71 + 72 * 39) * 2);
  });
});

describe('camera matrices', () => {
  const projection = perspective(Math.PI / 4, 16 / 9, 0.1, 50);
  // Looking slightly down (13°): the top of the screen sees the sky, the rest the ground.
  const view = lookAt([0, 1.6, 3.4], [0, 0.8, 0], [0, 1, 0]);
  const viewProjection = multiplyMatrices(projection, view);

  it('puts the point looked at in the centre of the screen', () => {
    const [x, y] = project(viewProjection, [0, 0.8, 0]);

    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('inverts a matrix', () => {
    const identity = multiplyMatrices(viewProjection, invertMatrix(viewProjection));

    [...identity].forEach((value, index) => {
      expect(value).toBeCloseTo(index % 5 === 0 ? 1 : 0);
    });
  });

  it('finds the ground point under a screen position, and nothing above the horizon', () => {
    const inverse = invertMatrix(viewProjection);
    const [screenX, screenY] = project(viewProjection, [0.8, 0, -0.5]);

    const ground = unprojectToGround(inverse, screenX, screenY);

    expect(ground?.[0]).toBeCloseTo(0.8);
    expect(ground?.[1]).toBeCloseTo(-0.5);
    expect(unprojectToGround(inverse, 0, 0.99)).toBeNull();
  });
});
