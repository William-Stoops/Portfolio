type LayoutShift = { value: number; startTime: number; hadRecentInput: boolean };

// A session of layout shifts ends after a second without one, or five seconds after it
// began: how browsers and Lighthouse have scored Cumulative Layout Shift since 2021.
const SESSION_GAP_MS = 1000;
const SESSION_MAX_MS = 5000;

// Cumulative Layout Shift: the shifts grouped in sessions, and the page scored by its worst
// session rather than by the sum of a whole visit. A shift right after the visitor's own
// input is expected, and does not count.
export function cumulativeLayoutShift(shifts: readonly LayoutShift[]): number {
  let worst = 0;
  let session = 0;
  let sessionStart = Number.NEGATIVE_INFINITY;
  let previous = Number.NEGATIVE_INFINITY;
  for (const { value, startTime, hadRecentInput } of shifts) {
    if (hadRecentInput) {
      continue;
    }
    if (startTime - previous < SESSION_GAP_MS && startTime - sessionStart < SESSION_MAX_MS) {
      session += value;
    } else {
      session = value;
      sessionStart = startTime;
    }
    previous = startTime;
    worst = Math.max(worst, session);
  }
  return worst;
}

type Resource = { name: string; encodedBodySize: number };

// The JavaScript the page has fetched, as it travelled (compressed): the resources whose
// path is a script's.
export function scriptBytes(resources: readonly Resource[]): number {
  return resources
    .filter(({ name }) => new URL(name).pathname.endsWith('.js'))
    .reduce((total, { encodedBodySize }) => total + encodedBodySize, 0);
}
