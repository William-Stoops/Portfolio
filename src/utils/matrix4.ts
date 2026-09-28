// 4 × 4 matrix maths for the WebGL scenes, kept out of the WebGL code so it can be
// unit-tested. Matrices are column-major, as WebGL expects them.

export type Matrix4 = Float32Array;
export type Vector3 = readonly [number, number, number];

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

export function subtract(a: Vector3, b: Vector3): Vector3 {
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
export function transformPoint(matrix: Matrix4, [x, y, z]: Vector3): Vector3 {
  const component = (row: number): number =>
    at(matrix, row) * x + at(matrix, 4 + row) * y + at(matrix, 8 + row) * z + at(matrix, 12 + row);
  const w = component(3);
  return [component(0) / w, component(1) / w, component(2) / w];
}
