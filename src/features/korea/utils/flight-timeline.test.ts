import { assert, describe, expect, it } from 'vitest';

import { easeInOut, flightMoment, sceneProgress } from '@/features/korea/utils/flight-timeline';
import motionCss from '@/styles/motion.css?raw';

// The rules of a block of motion.css, from its opening line to its closing brace.
function cssBlock(opening: string): string {
  const start = motionCss.indexOf(`${opening} {`);
  let depth = 0;
  for (let index = motionCss.indexOf('{', start); index < motionCss.length; index += 1) {
    depth += motionCss[index] === '{' ? 1 : motionCss[index] === '}' ? -1 : 0;
    if (depth === 0) {
      return motionCss.slice(start, index + 1);
    }
  }
  return '';
}

// The animation range of a voyage-* utility where the scene is pinned, as shares.
const PINNED_RANGE = /min-height: 40rem\)\s*\{[^}]*animation-range: contain (\d+)% contain (\d+)%/;

function pinnedRange(utility: string): { start: number; end: number } {
  const [, start = 'NaN', end = 'NaN'] = PINNED_RANGE.exec(cssBlock(`@utility ${utility}`)) ?? [];
  return { start: Number(start) / 100, end: Number(end) / 100 };
}

// The globe's plane is moved by script, the flag and the greeting by CSS: they meet only
// if the script reads the same timeline as the CSS plane. The tests below read it from
// motion.css, the source of truth.
const FLIGHT = pinnedRange('voyage-flight');
const ALTITUDE_KEYFRAMES = [
  ...cssBlock('@keyframes altitude').matchAll(/(\d+)%\s*\{\s*scale: ([\d.]+);/g),
].map(([, offset, scale]) => ({ offset: Number(offset) / 100, scale: Number(scale) }));

// A point of the flight, as a share of its range, in the pinned scene's timeline.
function during(share: number): number {
  return FLIGHT.start + (FLIGHT.end - FLIGHT.start) * share;
}

describe('easeInOut', () => {
  it('follows the CSS ease-in-out curve', () => {
    // Reference values of cubic-bezier(0.42, 0, 0.58, 1), solved by bisection.
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(0.1)).toBeCloseTo(0.01972, 4);
    expect(easeInOut(0.25)).toBeCloseTo(0.12916, 4);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 4);
    expect(easeInOut(0.9)).toBeCloseTo(0.98028, 4);
    expect(easeInOut(1)).toBe(1);
  });
});

describe('sceneProgress', () => {
  const viewport = 900;
  // The track is 260vh: pinned for 160vh.
  const height = 2340;

  it('enters while the track rises into view', () => {
    expect(sceneProgress({ top: viewport, height }, viewport)).toEqual({ entry: 0, contain: 0 });
    expect(sceneProgress({ top: viewport / 2, height }, viewport).entry).toBeCloseTo(0.5);
  });

  it('runs while the scene is pinned, from the track at the top to its end at the bottom', () => {
    expect(sceneProgress({ top: 0, height }, viewport)).toEqual({ entry: 1, contain: 0 });
    expect(sceneProgress({ top: -720, height }, viewport).contain).toBeCloseTo(0.5);
    expect(sceneProgress({ top: -2000, height }, viewport)).toEqual({ entry: 1, contain: 1 });
  });
});

describe('flightMoment', () => {
  it('reads the CSS flight range, eased in and out as the CSS plane is', () => {
    expect(FLIGHT).toEqual({ start: 0.05, end: 0.45 });
    expect(cssBlock('@utility voyage-flight')).toContain('ease-in-out');
    expect(pinnedRange('voyage-altitude')).toEqual(FLIGHT);
  });

  it('waits on the ground, then flies the route at the pace of the CSS plane, then lands', () => {
    expect(flightMoment(0).flown).toBe(0);
    expect(flightMoment(during(0)).flown).toBe(0);
    expect(flightMoment(during(0.25)).flown).toBeCloseTo(easeInOut(0.25));
    expect(flightMoment(during(0.5)).flown).toBeCloseTo(0.5);
    expect(flightMoment(during(1)).flown).toBe(1);
    expect(flightMoment(0.9).flown).toBe(1);
  });

  it('climbs and comes down at the CSS keyframes, then gives way to the flag', () => {
    expect(ALTITUDE_KEYFRAMES).toHaveLength(4);
    for (const { offset, scale } of ALTITUDE_KEYFRAMES) {
      expect(flightMoment(during(offset)).planeScale).toBeCloseTo(scale);
    }
    expect(flightMoment(during(1)).planeScale).toBe(0);
  });

  it('eases each stretch between keyframes, as CSS does', () => {
    const [first, second] = ALTITUDE_KEYFRAMES;
    assert(first !== undefined && second !== undefined);
    const quarter = first.offset + (second.offset - first.offset) / 4;

    expect(flightMoment(during(quarter)).planeScale).toBeCloseTo(
      first.scale + (second.scale - first.scale) * easeInOut(0.25),
    );
  });
});
