import { SURFACE_GRID } from '@/features/experience/data/surface-grid';
import { sigmaAt, type VolatilitySurface } from '@/features/experience/utils/volatility-grid';

// Where the lab looks at its surface from, in radians: turned around the vertical axis
// (yaw), tilted over the floor (pitch).
export type Camera = { yaw: number; pitch: number };
// From the camera's plane to canvas pixels.
export type View = { scale: number; x: number; y: number };
// A point on the canvas, and how far it is from the eye.
export type ScreenPoint = readonly [x: number, y: number, depth: number];

export type Quad = {
  strike: number;
  maturity: number;
  corners: readonly [ScreenPoint, ScreenPoint, ScreenPoint, ScreenPoint];
  // Lambert light on the cell, 0.6 to 1: the relief reads at a glance.
  shade: number;
  // The cell's volatility between the surface's lowest (0) and highest (1).
  level: number;
  // How far the cell has faded in during the intro, 0 to 1.
  appear: number;
  depth: number;
};

export const DEFAULT_CAMERA: Camera = { yaw: -0.62, pitch: 0.5 };
// The intro starts from above, as a heat map, then tilts to the default view.
export const INTRO_CAMERA: Camera = { yaw: -0.95, pitch: 1.3 };
const PITCH_RANGE = { min: 0.12, max: 1.3 };

// A floor under the surface, as in any plotting library: the lowest value floats just above.
const BASE = 0.08;
const RELIEF = 0.8;
const PIVOT_Y = (BASE + RELIEF) / 2;
const DISTANCE = 4.8;
// Where the ticks and the axis titles sit, beyond the floor's edges.
export const TICK_OFFSET = 1.16;
export const TITLE_OFFSET = 1.6;
const LIGHT = normalise([-0.35, 0.85, -0.4]);

function normalise([x, y, z]: readonly [number, number, number]): [number, number, number] {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

export function clampPitch(pitch: number): number {
  return Math.min(PITCH_RANGE.max, Math.max(PITCH_RANGE.min, pitch));
}

function worldX(strike: number): number {
  return -1 + (2 * strike) / (SURFACE_GRID.strikes - 1);
}

function worldZ(maturity: number): number {
  return -1 + (2 * maturity) / (SURFACE_GRID.maturities - 1);
}

// A strike or a maturity in its own unit, placed on the floor's axis.
export function axisPosition(value: number, min: number, max: number): number {
  return -1 + (2 * (value - min)) / (max - min);
}

function levelOf(surface: VolatilitySurface, strike: number, maturity: number): number {
  return (sigmaAt(surface, strike, maturity) - surface.low) / (surface.high - surface.low);
}

function heightOf(
  surface: VolatilitySurface,
  strike: number,
  maturity: number,
  lift: number,
): number {
  return (BASE + levelOf(surface, strike, maturity) * RELIEF) * lift;
}

function rotate(camera: Camera, x: number, y: number, z: number): ScreenPoint {
  const cosYaw = Math.cos(camera.yaw);
  const sinYaw = Math.sin(camera.yaw);
  const cosPitch = Math.cos(camera.pitch);
  const sinPitch = Math.sin(camera.pitch);
  const turnedX = x * cosYaw - z * sinYaw;
  const turnedZ = x * sinYaw + z * cosYaw;
  const lifted = y - PIVOT_Y;
  // Looking down on the floor: the far side rises on screen, the tops face the reader.
  const screenY = lifted * cosPitch + turnedZ * sinPitch;
  const depth = turnedZ * cosPitch - lifted * sinPitch;
  const perspective = DISTANCE / (DISTANCE + depth);
  return [turnedX * perspective, screenY * perspective, depth];
}

export function project(camera: Camera, view: View, x: number, y: number, z: number): ScreenPoint {
  const [u, v, depth] = rotate(camera, x, y, z);
  return [view.x + u * view.scale, view.y - v * view.scale, depth];
}

// Frames the surface once, on the default view, its labels included: turning it afterwards
// keeps the same zoom.
export function fitView(
  surface: VolatilitySurface,
  width: number,
  height: number,
  margin: { x: number; y: number },
): View {
  const points: ScreenPoint[] = [];
  for (let strike = 0; strike < SURFACE_GRID.strikes; strike += 1) {
    for (let maturity = 0; maturity < SURFACE_GRID.maturities; maturity += 1) {
      points.push(
        rotate(
          DEFAULT_CAMERA,
          worldX(strike),
          heightOf(surface, strike, maturity, 1),
          worldZ(maturity),
        ),
      );
    }
  }
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      points.push(rotate(DEFAULT_CAMERA, x, 0, z));
    }
  }
  points.push(
    rotate(DEFAULT_CAMERA, 0, 0, -TITLE_OFFSET),
    rotate(DEFAULT_CAMERA, TITLE_OFFSET, 0, 0),
  );
  const us = points.map(([u]) => u);
  const vs = points.map(([, v]) => v);
  const [minU, maxU, minV, maxV] = [
    Math.min(...us),
    Math.max(...us),
    Math.min(...vs),
    Math.max(...vs),
  ];
  const scale = Math.min(
    (width - 2 * margin.x) / (maxU - minU),
    (height - 2 * margin.y) / (maxV - minV),
  );
  return {
    scale,
    x: width / 2 - (scale * (minU + maxU)) / 2,
    y: height / 2 + (scale * (minV + maxV)) / 2,
  };
}

// The surface's cells on the canvas, farthest first (the painter's order: the nearer relief
// hides what is behind it). `lift` raises it from the floor, `sweep` fills it in the order a
// solver goes, short maturities first.
export function buildQuads(
  surface: VolatilitySurface,
  camera: Camera,
  view: View,
  { lift, sweep }: { lift: number; sweep: number },
): Quad[] {
  const quads: Quad[] = [];
  const stepX = 2 / (SURFACE_GRID.strikes - 1);
  const stepZ = 2 / (SURFACE_GRID.maturities - 1);
  for (let strike = 0; strike < SURFACE_GRID.strikes - 1; strike += 1) {
    for (let maturity = 0; maturity < SURFACE_GRID.maturities - 1; maturity += 1) {
      const appear = Math.min(
        1,
        Math.max(0, sweep * 1.5 - (maturity / (SURFACE_GRID.maturities - 1)) * 0.5),
      );
      if (appear <= 0) {
        continue;
      }
      const h00 = heightOf(surface, strike, maturity, lift);
      const h10 = heightOf(surface, strike + 1, maturity, lift);
      const h11 = heightOf(surface, strike + 1, maturity + 1, lift);
      const h01 = heightOf(surface, strike, maturity + 1, lift);
      const corners = [
        project(camera, view, worldX(strike), h00, worldZ(maturity)),
        project(camera, view, worldX(strike + 1), h10, worldZ(maturity)),
        project(camera, view, worldX(strike + 1), h11, worldZ(maturity + 1)),
        project(camera, view, worldX(strike), h01, worldZ(maturity + 1)),
      ] as const;
      // The cell's normal, from its two diagonals' slopes.
      const slopeX = (h10 - h00 + h11 - h01) / 2;
      const slopeZ = (h01 - h00 + h11 - h10) / 2;
      const normal = normalise([-slopeX * stepZ, stepX * stepZ, -stepX * slopeZ]);
      const light = Math.abs(normal[0] * LIGHT[0] + normal[1] * LIGHT[1] + normal[2] * LIGHT[2]);
      quads.push({
        strike,
        maturity,
        corners,
        shade: 0.6 + 0.4 * light,
        level:
          (levelOf(surface, strike, maturity) + levelOf(surface, strike + 1, maturity + 1)) / 2,
        appear,
        depth: (corners[0][2] + corners[1][2] + corners[2][2] + corners[3][2]) / 4,
      });
    }
  }
  return quads.toSorted((a, b) => b.depth - a.depth);
}

function isInside(x: number, y: number, polygon: readonly ScreenPoint[]): boolean {
  let inside = false;
  for (
    let current = 0, previous = polygon.length - 1;
    current < polygon.length;
    previous = current++
  ) {
    const [xi, yi] = polygon[current] ?? [0, 0, 0];
    const [xj, yj] = polygon[previous] ?? [0, 0, 0];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// The front-most cell under a canvas point, if any.
export function pickQuad(quads: readonly Quad[], x: number, y: number): Quad | null {
  return quads.findLast((quad) => isInside(x, y, quad.corners)) ?? null;
}
