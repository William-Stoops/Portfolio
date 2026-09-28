// The globe's plane is moved by script while the flag and the greeting are moved by CSS,
// on the scroll timeline of the pinned scene (motion.css, voyage-*): this module reads the
// same timeline, so the plane lands as the flag unfurls. flight-timeline.test.ts holds
// both to the same ranges and keyframes.

// The share of the pinned scene the flight takes: `contain 5% contain 45%`.
const FLIGHT_RANGE = { start: 0.05, end: 0.45 } as const;

// `@keyframes altitude`: the plane climbs, comes down, and gives way once landed.
const ALTITUDE_KEYFRAMES = [
  [0, 0.7],
  [0.45, 1.15],
  [0.85, 0.6],
  [1, 0],
] as const;

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function cubicBezier(first: number, second: number, t: number): number {
  return 3 * (1 - t) ** 2 * t * first + 3 * (1 - t) * t ** 2 * second + t ** 3;
}

// CSS `ease-in-out`, cubic-bezier(0.42, 0, 0.58, 1): the time whose x is `progress`,
// found by bisection, gives the y.
export function easeInOut(progress: number): number {
  // Exact at the ends, where the flight must start and land exactly.
  if (progress <= 0 || progress >= 1) {
    return clamp(progress);
  }
  let low = 0;
  let high = 1;
  for (let step = 0; step < 32; step += 1) {
    const middle = (low + high) / 2;
    if (cubicBezier(0.42, 0.58, middle) < progress) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return cubicBezier(0, 1, (low + high) / 2);
}

// Where the scene stands, from its track's box: `entry` runs while the track rises into
// view (1 once its top reaches the top of the viewport), `contain` while the scene is
// pinned (the `contain` range of its view timeline: 1 once the track's end reaches the
// bottom of the viewport).
export function sceneProgress(
  { top, height }: { top: number; height: number },
  viewportHeight: number,
): { entry: number; contain: number } {
  return {
    entry: clamp(1 - top / viewportHeight),
    contain: clamp(-top / Math.max(height - viewportHeight, 1)),
  };
}

// A keyframe animation's value, CSS-style: the timing function eases each interval.
function keyframeValue(
  keyframes: readonly (readonly [number, number])[],
  progress: number,
): number {
  const next = keyframes.findIndex(([offset]) => offset >= progress);
  const [endOffset, endValue] = keyframes[Math.max(next, 0)] ?? [1, 0];
  const [startOffset, startValue] = keyframes[Math.max(next - 1, 0)] ?? [0, endValue];
  if (endOffset === startOffset) {
    return endValue;
  }
  const eased = easeInOut((progress - startOffset) / (endOffset - startOffset));
  return startValue + (endValue - startValue) * eased;
}

// The flight at a point of the pinned scene: the share of the route flown, eased as the
// CSS plane is (one interval), and the plane's scale.
export function flightMoment(contain: number): { flown: number; planeScale: number } {
  const progress = clamp((contain - FLIGHT_RANGE.start) / (FLIGHT_RANGE.end - FLIGHT_RANGE.start));
  return { flown: easeInOut(progress), planeScale: keyframeValue(ALTITUDE_KEYFRAMES, progress) };
}
