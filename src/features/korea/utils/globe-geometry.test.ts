import { describe, expect, it } from 'vitest';

import {
  facingRotation,
  HORIZON,
  projectOnGlobe,
  routePoint,
  sampleRoute,
  toCartesian,
  viewCentre,
} from '@/features/korea/utils/globe-geometry';
import { type Vector3 } from '@/utils/matrix4';

const PARIS = { latitude: 48.86, longitude: 2.35 };
const SEOUL = { latitude: 37.57, longitude: 126.98 };

function distanceBetween(a: Vector3, b: Vector3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

// The rotation's 3 × 3 part applied to a vector (column-major).
function rotate(rotation: Float32Array, [x, y, z]: Vector3): Vector3 {
  return [
    (rotation[0] ?? 0) * x + (rotation[4] ?? 0) * y + (rotation[8] ?? 0) * z,
    (rotation[1] ?? 0) * x + (rotation[5] ?? 0) * y + (rotation[9] ?? 0) * z,
    (rotation[2] ?? 0) * x + (rotation[6] ?? 0) * y + (rotation[10] ?? 0) * z,
  ];
}

// In degrees, seen from the centre of the globe, whatever the altitudes.
function angleBetween(a: Vector3, b: Vector3): number {
  const cosine = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b));
  return (Math.acos(Math.min(1, cosine)) * 180) / Math.PI;
}

// The radius of the globe's outline on the canvas, in shares of its side: where a point on
// the horizon, tangent to the camera's view, lands.
const LIMB_RADIUS =
  projectOnGlobe(
    [Math.sqrt(1 - HORIZON ** 2), 0, HORIZON],
    facingRotation({ latitude: 0, longitude: 0 }),
  ).x - 0.5;

describe('toCartesian', () => {
  it('puts the prime meridian on the equator in front, north up and east to the right', () => {
    expect(distanceBetween(toCartesian({ latitude: 0, longitude: 0 }), [0, 0, 1])).toBeCloseTo(0);
    expect(distanceBetween(toCartesian({ latitude: 90, longitude: 0 }), [0, 1, 0])).toBeCloseTo(0);
    expect(distanceBetween(toCartesian({ latitude: 0, longitude: 90 }), [1, 0, 0])).toBeCloseTo(0);
  });
});

describe('routePoint', () => {
  const paris = toCartesian(PARIS);
  const seoul = toCartesian(SEOUL);
  const route = { from: paris, to: seoul };
  const height = (share: number) => Math.hypot(...routePoint(route, share));

  it('takes off from the origin and lands on the destination, on the ground', () => {
    expect(distanceBetween(routePoint(route, 0), paris)).toBeCloseTo(0);
    expect(distanceBetween(routePoint(route, 1), seoul)).toBeCloseTo(0);
  });

  it('flies the great circle, the shortest way, at an even pace', () => {
    // Paris–Seoul spans about 80.6° of a great circle: some 8,970 km.
    expect(angleBetween(paris, seoul)).toBeCloseTo(80.6, 1);
    const quarter = routePoint(route, 0.25);

    expect(angleBetween(paris, quarter)).toBeCloseTo(80.6 / 4, 1);
    expect(angleBetween(quarter, seoul)).toBeCloseTo((80.6 * 3) / 4, 1);
  });

  it('flies over Siberia, far north of both ends', () => {
    const [x, y, z] = routePoint(route, 0.5);

    expect((Math.asin(y / Math.hypot(x, y, z)) * 180) / Math.PI).toBeGreaterThan(60);
  });

  it('rises in a gentle arc, highest halfway', () => {
    expect(height(0.25)).toBeGreaterThan(1);
    expect(height(0.5)).toBeGreaterThan(height(0.25));
    expect(height(0.5)).toBeLessThan(1.2);
    expect(height(0.75)).toBeCloseTo(height(0.25));
  });

  it('carries on along the same circle before the origin, on the ground', () => {
    const before = routePoint(route, -0.25);

    expect(Math.hypot(...before)).toBeCloseTo(1);
    expect(angleBetween(before, paris)).toBeCloseTo(80.6 / 4, 1);
    expect(angleBetween(before, seoul)).toBeCloseTo((80.6 * 5) / 4, 1);
  });
});

describe('facingRotation', () => {
  it('turns the globe so the centre faces the viewer, north up, east to the right', () => {
    const rotation = facingRotation(SEOUL);

    expect(distanceBetween(rotate(rotation, toCartesian(SEOUL)), [0, 0, 1])).toBeCloseTo(0);
    const north = rotate(rotation, [0, 1, 0]);
    expect(north[0]).toBeCloseTo(0);
    expect(north[1]).toBeGreaterThan(0);
    expect(rotate(rotation, toCartesian({ ...SEOUL, longitude: 140 }))[0]).toBeGreaterThan(0);
  });
});

describe('projectOnGlobe', () => {
  const rotation = facingRotation(SEOUL);

  it('draws the centre in the middle of the canvas', () => {
    const { x, y, isFacing } = projectOnGlobe(toCartesian(SEOUL), rotation);

    expect(x).toBeCloseTo(0.5);
    expect(y).toBeCloseTo(0.5);
    expect(isFacing).toBe(true);
  });

  it('draws north higher and east further right', () => {
    const north = projectOnGlobe(toCartesian({ ...SEOUL, latitude: 50 }), rotation);
    const east = projectOnGlobe(toCartesian({ ...SEOUL, longitude: 140 }), rotation);

    expect(north.y).toBeLessThan(0.5);
    expect(east.x).toBeGreaterThan(0.5);
  });

  it('draws the globe inside its limb, and hides what lies beyond the horizon', () => {
    const nearLimb = projectOnGlobe(
      toCartesian({ ...SEOUL, longitude: SEOUL.longitude + 70 }),
      rotation,
    );
    const behind = projectOnGlobe(
      toCartesian({ latitude: 0, longitude: SEOUL.longitude - 180 }),
      rotation,
    );

    expect(LIMB_RADIUS).toBeGreaterThan(0.4);
    expect(LIMB_RADIUS).toBeLessThan(0.5);
    expect(Math.hypot(nearLimb.x - 0.5, nearLimb.y - 0.5)).toBeLessThan(LIMB_RADIUS);
    expect(Math.hypot(nearLimb.x - 0.5, nearLimb.y - 0.5)).toBeGreaterThan(LIMB_RADIUS - 0.05);
    expect(nearLimb.isFacing).toBe(true);
    expect(behind.isFacing).toBe(false);
  });

  it('raises a point above the ground, towards the viewer', () => {
    const [x, y, z] = toCartesian({ latitude: 60, longitude: SEOUL.longitude });
    const ground = projectOnGlobe([x, y, z], rotation);
    const raised = projectOnGlobe([x * 1.1, y * 1.1, z * 1.1], rotation);

    expect(raised.y).toBeLessThan(ground.y);
  });
});

describe('sampleRoute', () => {
  const route = { from: toCartesian(PARIS), to: toCartesian(SEOUL) };

  it('samples the route as points with the share of the way each one stands at', () => {
    const samples = sampleRoute(route, 5);

    expect(samples).toHaveLength(5 * 4);
    expect(Array.from(samples.slice(0, 4))).toEqual([...routePoint(route, 0), 0].map(Math.fround));
    expect(samples[4 * 2 + 3]).toBe(0.5);
    expect(Array.from(samples.slice(16))).toEqual([...routePoint(route, 1), 1].map(Math.fround));
  });
});

describe('viewCentre', () => {
  const route = { from: toCartesian(PARIS), to: toCartesian(SEOUL) };
  const onScreen = (centre: ReturnType<typeof viewCentre>, place: typeof PARIS) =>
    projectOnGlobe(toCartesian(place), facingRotation(centre));

  it('shows both ends before the flight, the origin on the left, the destination on the right', () => {
    const centre = viewCentre(route, 0, 1);
    const paris = onScreen(centre, PARIS);
    const seoul = onScreen(centre, SEOUL);

    expect(paris.isFacing && seoul.isFacing).toBe(true);
    expect(paris.x).toBeLessThan(0.5);
    expect(seoul.x).toBeGreaterThan(0.5);
  });

  it('turns with the flight, bringing the destination towards the middle', () => {
    const before = onScreen(viewCentre(route, 0, 1), SEOUL);
    const after = onScreen(viewCentre(route, 1, 1), SEOUL);

    expect(after.isFacing).toBe(true);
    expect(after.x).toBeLessThan(before.x);
    expect(after.x).toBeGreaterThan(0.5);
  });

  it('sets the route over the upper half of the globe', () => {
    const centre = viewCentre(route, 0.5, 1);
    const highest = projectOnGlobe(routePoint(route, 0.5), facingRotation(centre));

    expect(highest.y).toBeLessThan(0.4);
  });

  it('turns in from further back while the scene rises into view', () => {
    const entering = onScreen(viewCentre(route, 0, 0), PARIS);
    const settled = onScreen(viewCentre(route, 0, 1), PARIS);

    expect(entering.x).toBeGreaterThan(settled.x);
  });
});
