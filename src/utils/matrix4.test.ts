import { describe, expect, it } from 'vitest';

import {
  invertMatrix,
  lookAt,
  multiplyMatrices,
  perspective,
  transformPoint,
} from '@/utils/matrix4';

// Projects a world point to the screen, independently of the module under test.
function project(matrix: Float32Array, [x, y, z]: readonly [number, number, number]) {
  const row = (index: number) =>
    (matrix[index] ?? 0) * x +
    (matrix[4 + index] ?? 0) * y +
    (matrix[8 + index] ?? 0) * z +
    (matrix[12 + index] ?? 0);
  return [row(0) / row(3), row(1) / row(3)] as const;
}

describe('camera matrices', () => {
  const projection = perspective(Math.PI / 4, 16 / 9, 0.1, 50);
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

  it('transforms a point as the GPU does, divided by w', () => {
    const [x, y] = transformPoint(viewProjection, [0.4, 1.1, -0.3]);
    const [expectedX, expectedY] = project(viewProjection, [0.4, 1.1, -0.3]);

    expect(x).toBeCloseTo(expectedX);
    expect(y).toBeCloseTo(expectedY);
  });
});
