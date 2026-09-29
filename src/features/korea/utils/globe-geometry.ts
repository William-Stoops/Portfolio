import { type GeoPoint } from '@/features/korea/types/geo-point';
import { easeInOut } from '@/features/korea/utils/flight-timeline';
import {
  lookAt,
  type Matrix4,
  multiplyMatrices,
  perspective,
  transformPoint,
  type Vector3,
} from '@/utils/matrix4';

// The globe of the voyage: a unit sphere seen from the front by a fixed camera, turned so
// the place being flown over faces the viewer. Kept out of the WebGL code so it can be
// unit-tested; the renderer and the HTML overlay (plane, places) share it, so both agree
// to the pixel.

// The camera's distance from the centre, in globe radii: far enough for a gentle
// perspective, near enough for the globe to feel round.
const CAMERA_DISTANCE = 3.2;
// The globe's outline spans this share of the canvas's side, leaving room for the route
// that rises above it. FlightGlobe draws the globe's body at this size (inset-[4%]).
const GLOBE_LIMB = 0.92;
// On the sphere, what faces the camera lies beyond this height towards it: the horizon.
export const HORIZON = 1 / CAMERA_DISTANCE;

const DEGREE = Math.PI / 180;

// The field of view that makes the globe's outline span GLOBE_LIMB of the canvas: the
// outline is the cone from the camera tangent to the sphere.
const FIELD_OF_VIEW = 2 * Math.atan(1 / Math.sqrt(CAMERA_DISTANCE ** 2 - 1) / GLOBE_LIMB);

// The canvas is square.
export const GLOBE_VIEW_PROJECTION = multiplyMatrices(
  perspective(FIELD_OF_VIEW, 1, 0.1, 10),
  lookAt([0, 0, CAMERA_DISTANCE], [0, 0, 0], [0, 1, 0]),
);

export function toCartesian({ latitude, longitude }: GeoPoint): Vector3 {
  const cosLatitude = Math.cos(latitude * DEGREE);
  return [
    cosLatitude * Math.sin(longitude * DEGREE),
    Math.sin(latitude * DEGREE),
    cosLatitude * Math.cos(longitude * DEGREE),
  ];
}

// The point `share` of the way from one place to another along the great circle, the
// shortest way, as a plane flies it. Below 0 or above 1 it carries on along the circle.
function alongGreatCircle(from: Vector3, to: Vector3, share: number): Vector3 {
  const angle = Math.acos(
    Math.min(1, Math.max(-1, from[0] * to[0] + from[1] * to[1] + from[2] * to[2])),
  );
  const fromWeight = Math.sin((1 - share) * angle) / Math.sin(angle);
  const toWeight = Math.sin(share * angle) / Math.sin(angle);
  return [
    from[0] * fromWeight + to[0] * toWeight,
    from[1] * fromWeight + to[1] * toWeight,
    from[2] * fromWeight + to[2] * toWeight,
  ];
}

// The rotation that brings `centre` in front of the camera, north kept up: a turn about
// the poles to its meridian, then a tilt to its parallel.
export function facingRotation({ latitude, longitude }: GeoPoint): Matrix4 {
  const cosLatitude = Math.cos(latitude * DEGREE);
  const sinLatitude = Math.sin(latitude * DEGREE);
  const cosLongitude = Math.cos(longitude * DEGREE);
  const sinLongitude = Math.sin(longitude * DEGREE);
  // Column-major.
  return Float32Array.of(
    cosLongitude,
    -sinLatitude * sinLongitude,
    cosLatitude * sinLongitude,
    0,
    0,
    cosLatitude,
    sinLatitude,
    0,
    -sinLongitude,
    -sinLatitude * cosLongitude,
    cosLatitude * cosLongitude,
    0,
    0,
    0,
    0,
    1,
  );
}

function toGeoPoint([x, y, z]: Vector3): GeoPoint {
  const length = Math.hypot(x, y, z);
  return { latitude: Math.asin(y / length) / DEGREE, longitude: Math.atan2(x, z) / DEGREE };
}

// Where a point of the (turned) globe lands on the canvas, from its top left corner, in
// shares of the canvas's side, and whether the ground under it faces the viewer.
export function projectOnGlobe(
  point: Vector3,
  rotation: Matrix4,
): { x: number; y: number; isFacing: boolean } {
  const [screenX, screenY] = transformPoint(
    multiplyMatrices(GLOBE_VIEW_PROJECTION, rotation),
    point,
  );
  const depth =
    ((rotation[2] ?? 0) * point[0] +
      (rotation[6] ?? 0) * point[1] +
      (rotation[10] ?? 0) * point[2]) /
    Math.hypot(...point);
  return { x: (screenX + 1) / 2, y: (1 - screenY) / 2, isFacing: depth > HORIZON };
}

// A flight between two places of the unit sphere.
export type GlobeRoute = { from: Vector3; to: Vector3 };

// How high the route rises halfway, in globe radii: an arc above the ground, as flights
// are drawn on maps.
const ROUTE_RISE = 0.1;

// The point of the flight `share` of the way, at its altitude.
export function routePoint({ from, to }: GlobeRoute, share: number): Vector3 {
  const height = 1 + ROUTE_RISE * Math.sin(Math.PI * Math.min(1, Math.max(0, share)));
  const [x, y, z] = alongGreatCircle(from, to, share);
  return [x * height, y * height, z * height];
}

// `count` points along the flight, evenly spaced, each with the share of the way it
// stands at (x, y, z, share): the renderer draws the flown part and the rest apart.
export function sampleRoute(route: GlobeRoute, count: number): Float32Array {
  const samples = new Float32Array(count * 4);
  for (let index = 0; index < count; index += 1) {
    const share = index / (count - 1);
    samples.set([...routePoint(route, share), share], index * 4);
  }
  return samples;
}

// The share of the route the globe faces before the flight and after it: the origin on
// one side, the destination on the other, the globe turning with the plane in between.
const VIEW_SHARES = { start: 0.3, end: 0.7 } as const;
// How far back the view starts while the scene rises into view: the globe turns in.
const ENTRY_TURN = 0.4;
// Degrees south of the route: the route arcs over the upper half of the globe.
const VIEW_TILT = 24;

// The place the globe faces at a moment of the flight (`flown`, 0 to 1) and of the scene's
// arrival (`entry`, 0 to 1).
export function viewCentre(route: GlobeRoute, flown: number, entry: number): GeoPoint {
  const share =
    VIEW_SHARES.start +
    (VIEW_SHARES.end - VIEW_SHARES.start) * flown -
    ENTRY_TURN * (1 - easeInOut(entry));
  const { latitude, longitude } = toGeoPoint(alongGreatCircle(route.from, route.to, share));
  return { latitude: latitude - VIEW_TILT, longitude };
}
