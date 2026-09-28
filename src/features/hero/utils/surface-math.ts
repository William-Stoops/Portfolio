import { type Matrix4, subtract, transformPoint } from '@/utils/matrix4';

// Geometry of the hero scene, kept out of the WebGL code so it can be unit-tested.

// Points of a columns × rows grid spread from -1 to 1 on both axes, row by row: x across
// strikes, y across maturities. The height is computed on the GPU from these.
export function buildSurfaceGrid(columns: number, rows: number): Float32Array {
  const grid = new Float32Array(columns * rows * 2);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const offset = (row * columns + column) * 2;
      grid[offset] = (column / (columns - 1)) * 2 - 1;
      grid[offset + 1] = (row / (rows - 1)) * 2 - 1;
    }
  }
  return grid;
}

// Segments of the wireframe (gl.LINES): along each row (one smile per maturity), then
// along each column (one term structure per strike).
export function buildWireframeIndices(columns: number, rows: number): Uint16Array {
  const indices: number[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      indices.push(row * columns + column, row * columns + column + 1);
    }
  }
  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows - 1; row += 1) {
      indices.push(row * columns + column, (row + 1) * columns + column);
    }
  }
  return Uint16Array.from(indices);
}

// The ground point (y = 0) seen at a screen position, as [x, z]: where the pointer touches
// the surface. Null when the ray from the camera does not come down to the ground.
export function unprojectToGround(
  inverseViewProjection: Matrix4,
  screenX: number,
  screenY: number,
): readonly [number, number] | null {
  const near = transformPoint(inverseViewProjection, [screenX, screenY, -1]);
  const far = transformPoint(inverseViewProjection, [screenX, screenY, 1]);
  const direction = subtract(far, near);
  if (direction[1] >= 0) {
    return null;
  }
  const distance = -near[1] / direction[1];
  return [near[0] + direction[0] * distance, near[2] + direction[2] * distance];
}
