// Geometry and camera maths of the hero scene, kept out of the WebGL code so they can be
// unit-tested. Matrices are 4 × 4, column-major, as WebGL expects them.

type Matrix4 = Float32Array;
type Vector3 = readonly [number, number, number];

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

export function perspective(
  fieldOfView: number,
  aspect: number,
  near: number,
  far: number,
): Matrix4 {
  const focal = 1 / Math.tan(fieldOfView / 2);
  const depth = 1 / (near - far);
  return Float32Array.of(
    focal / aspect,
    0,
    0,
    0,
    0,
    focal,
    0,
    0,
    0,
    0,
    (far + near) * depth,
    -1,
    0,
    0,
    2 * far * near * depth,
    0,
  );
}

function subtract(a: Vector3, b: Vector3): Vector3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vector3, b: Vector3): Vector3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot(a: Vector3, b: Vector3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(vector: Vector3): Vector3 {
  const length = Math.hypot(...vector);
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

export function lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
  const forward = normalize(subtract(eye, target));
  const right = normalize(cross(up, forward));
  const trueUp = cross(forward, right);
  return Float32Array.of(
    right[0],
    trueUp[0],
    forward[0],
    0,
    right[1],
    trueUp[1],
    forward[1],
    0,
    right[2],
    trueUp[2],
    forward[2],
    0,
    -dot(right, eye),
    -dot(trueUp, eye),
    -dot(forward, eye),
    1,
  );
}

function at(matrix: Matrix4, index: number): number {
  return matrix[index] ?? 0;
}

export function multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4 {
  const product = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      let sum = 0;
      for (let k = 0; k < 4; k += 1) {
        sum += at(a, k * 4 + row) * at(b, column * 4 + k);
      }
      product[column * 4 + row] = sum;
    }
  }
  return product;
}

// General 4 × 4 inverse by cofactors (the view-projection is not orthogonal).
export function invertMatrix(matrix: Matrix4): Matrix4 {
  const m = (index: number): number => at(matrix, index);
  const inverse = Float32Array.of(
    m(5) * m(10) * m(15) -
      m(5) * m(11) * m(14) -
      m(9) * m(6) * m(15) +
      m(9) * m(7) * m(14) +
      m(13) * m(6) * m(11) -
      m(13) * m(7) * m(10),
    -m(1) * m(10) * m(15) +
      m(1) * m(11) * m(14) +
      m(9) * m(2) * m(15) -
      m(9) * m(3) * m(14) -
      m(13) * m(2) * m(11) +
      m(13) * m(3) * m(10),
    m(1) * m(6) * m(15) -
      m(1) * m(7) * m(14) -
      m(5) * m(2) * m(15) +
      m(5) * m(3) * m(14) +
      m(13) * m(2) * m(7) -
      m(13) * m(3) * m(6),
    -m(1) * m(6) * m(11) +
      m(1) * m(7) * m(10) +
      m(5) * m(2) * m(11) -
      m(5) * m(3) * m(10) -
      m(9) * m(2) * m(7) +
      m(9) * m(3) * m(6),
    -m(4) * m(10) * m(15) +
      m(4) * m(11) * m(14) +
      m(8) * m(6) * m(15) -
      m(8) * m(7) * m(14) -
      m(12) * m(6) * m(11) +
      m(12) * m(7) * m(10),
    m(0) * m(10) * m(15) -
      m(0) * m(11) * m(14) -
      m(8) * m(2) * m(15) +
      m(8) * m(3) * m(14) +
      m(12) * m(2) * m(11) -
      m(12) * m(3) * m(10),
    -m(0) * m(6) * m(15) +
      m(0) * m(7) * m(14) +
      m(4) * m(2) * m(15) -
      m(4) * m(3) * m(14) -
      m(12) * m(2) * m(7) +
      m(12) * m(3) * m(6),
    m(0) * m(6) * m(11) -
      m(0) * m(7) * m(10) -
      m(4) * m(2) * m(11) +
      m(4) * m(3) * m(10) +
      m(8) * m(2) * m(7) -
      m(8) * m(3) * m(6),
    m(4) * m(9) * m(15) -
      m(4) * m(11) * m(13) -
      m(8) * m(5) * m(15) +
      m(8) * m(7) * m(13) +
      m(12) * m(5) * m(11) -
      m(12) * m(7) * m(9),
    -m(0) * m(9) * m(15) +
      m(0) * m(11) * m(13) +
      m(8) * m(1) * m(15) -
      m(8) * m(3) * m(13) -
      m(12) * m(1) * m(11) +
      m(12) * m(3) * m(9),
    m(0) * m(5) * m(15) -
      m(0) * m(7) * m(13) -
      m(4) * m(1) * m(15) +
      m(4) * m(3) * m(13) +
      m(12) * m(1) * m(7) -
      m(12) * m(3) * m(5),
    -m(0) * m(5) * m(11) +
      m(0) * m(7) * m(9) +
      m(4) * m(1) * m(11) -
      m(4) * m(3) * m(9) -
      m(8) * m(1) * m(7) +
      m(8) * m(3) * m(5),
    -m(4) * m(9) * m(14) +
      m(4) * m(10) * m(13) +
      m(8) * m(5) * m(14) -
      m(8) * m(6) * m(13) -
      m(12) * m(5) * m(10) +
      m(12) * m(6) * m(9),
    m(0) * m(9) * m(14) -
      m(0) * m(10) * m(13) -
      m(8) * m(1) * m(14) +
      m(8) * m(2) * m(13) +
      m(12) * m(1) * m(10) -
      m(12) * m(2) * m(9),
    -m(0) * m(5) * m(14) +
      m(0) * m(6) * m(13) +
      m(4) * m(1) * m(14) -
      m(4) * m(2) * m(13) -
      m(12) * m(1) * m(6) +
      m(12) * m(2) * m(5),
    m(0) * m(5) * m(10) -
      m(0) * m(6) * m(9) -
      m(4) * m(1) * m(10) +
      m(4) * m(2) * m(9) +
      m(8) * m(1) * m(6) -
      m(8) * m(2) * m(5),
  );
  const determinant =
    m(0) * at(inverse, 0) + m(1) * at(inverse, 4) + m(2) * at(inverse, 8) + m(3) * at(inverse, 12);
  return inverse.map((value) => value / determinant);
}

// A world point through the matrix, divided by w: normalised device coordinates.
function transformPoint(matrix: Matrix4, [x, y, z]: Vector3): Vector3 {
  const component = (row: number): number =>
    at(matrix, row) * x + at(matrix, 4 + row) * y + at(matrix, 8 + row) * z + at(matrix, 12 + row);
  const w = component(3);
  return [component(0) / w, component(1) / w, component(2) / w];
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
