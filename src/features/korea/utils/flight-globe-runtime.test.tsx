import { afterEach, assert, describe, expect, it, vi } from 'vitest';

import { type FlightDirection } from '@/features/korea/types/flight-direction';
import { startFlightGlobe } from '@/features/korea/utils/flight-globe-runtime';

const GLOBE_SIDE = 400;
// The flight's range in the pinned scene (motion.css, voyage-flight: contain 5% → 45%).
const FLIGHT_RANGE = { start: 0.05, end: 0.45 } as const;

afterEach(() => {
  vi.restoreAllMocks();
  document.querySelectorAll('[data-test-fixture]').forEach((element) => {
    element.remove();
  });
  window.scrollTo(0, 0);
});

// A pinned flight scene as FlightScene renders it: a track three screens tall after a
// screen of page, holding the globe, its places and its plane.
function renderScene(): { track: HTMLElement; globe: HTMLElement } {
  const spacer = document.createElement('div');
  spacer.style.height = `${String(window.innerHeight)}px`;
  const track = document.createElement('div');
  track.style.height = `${String(window.innerHeight * 3)}px`;
  const globe = document.createElement('div');
  globe.style.cssText = `position: relative; width: ${String(GLOBE_SIDE)}px; height: ${String(GLOBE_SIDE)}px`;
  globe.innerHTML = `
    <canvas style="width: 100%; height: 100%; color: rgb(110, 168, 254); border-top-color: rgb(139, 147, 167); text-decoration-color: rgb(125, 134, 156)"></canvas>
    <span data-globe-place="origin"></span>
    <span data-globe-place="destination"></span>
    <div data-globe-plane></div>`;
  track.append(globe);
  for (const element of [spacer, track]) {
    element.dataset['testFixture'] = '';
    document.body.append(element);
  }
  return { track, globe };
}

function nextFrame(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

// The globe draws on the frame after a scroll: a few frames leave it time.
async function nextFrames(): Promise<void> {
  await nextFrame();
  await nextFrame();
  await nextFrame();
}

// Scrolls to a point of the pinned stretch (0: the track at the top of the viewport).
async function scrollToContain(track: HTMLElement, contain: number): Promise<void> {
  window.scrollTo(0, track.offsetTop + (track.offsetHeight - window.innerHeight) * contain);
  await nextFrames();
}

function positionOf(globe: HTMLElement, selector: string): { x: number; y: number } {
  const element = globe.querySelector(selector);
  assert(element instanceof HTMLElement);
  const [x = Number.NaN, y = Number.NaN] = element.style.translate.split(' ').map(parseFloat);
  return { x, y };
}

async function startScene(direction: FlightDirection) {
  const scene = renderScene();
  const stop = startFlightGlobe(scene, direction);
  assert(stop !== null, 'the test browser has WebGL2');
  await scrollToContain(scene.track, 0);
  // The first frame waits for the scene to be seen near the viewport.
  await expect
    .poll(() => scene.globe.querySelector('[data-globe-plane]')?.getAttribute('style'))
    .toBeTruthy();
  return { ...scene, stop };
}

describe('startFlightGlobe', () => {
  it('flies the plane from France to Seoul as the scene scrolls by', async () => {
    const { track, globe, stop } = await startScene('east');
    const origin = positionOf(globe, '[data-globe-place="origin"]');
    const takeoff = positionOf(globe, '[data-globe-plane]');

    expect(takeoff.x).toBeCloseTo(origin.x, 0);
    expect(takeoff.y).toBeCloseTo(origin.y, 0);

    await scrollToContain(track, (FLIGHT_RANGE.start + FLIGHT_RANGE.end) / 2);
    const cruise = positionOf(globe, '[data-globe-plane]');
    // Halfway, the route rises over Siberia: the plane flies higher than both ends.
    expect(cruise.x).toBeGreaterThan(takeoff.x);
    expect(cruise.y).toBeLessThan(takeoff.y);

    await scrollToContain(track, FLIGHT_RANGE.end);
    const destination = positionOf(globe, '[data-globe-place="destination"]');
    const landing = positionOf(globe, '[data-globe-plane]');
    expect(destination.x).toBeGreaterThan(origin.x);
    expect(landing.x).toBeCloseTo(destination.x, 0);
    expect(landing.y).toBeCloseTo(destination.y, 0);
    stop();
  });

  it('turns the plane to its heading, and lets it give way once landed', async () => {
    const { track, globe, stop } = await startScene('east');
    const plane = globe.querySelector('[data-globe-plane]');
    assert(plane instanceof HTMLElement);

    await scrollToContain(track, (FLIGHT_RANGE.start + FLIGHT_RANGE.end) / 2);
    // Flying east: the icon's nose (up and to the right) turned towards the right.
    expect(parseFloat(plane.style.rotate)).toBeGreaterThan(0);
    expect(parseFloat(plane.style.rotate)).toBeLessThan(90);
    expect(Number(plane.style.scale)).toBeGreaterThan(1);

    await scrollToContain(track, 0.8);
    expect(Number(plane.style.scale)).toBe(0);
    stop();
  });

  it('flies home west, from Seoul on the right to France on the left', async () => {
    const { track, globe, stop } = await startScene('west');
    const takeoff = positionOf(globe, '[data-globe-plane]');

    await scrollToContain(track, FLIGHT_RANGE.end);
    const landing = positionOf(globe, '[data-globe-plane]');

    expect(landing.x).toBeLessThan(takeoff.x);
    stop();
  });

  it('sizes the canvas to its box, in device pixels', async () => {
    const { globe, stop } = await startScene('east');
    const canvas = globe.querySelector('canvas');

    await expect
      .poll(() => canvas?.width)
      .toBe(Math.round(GLOBE_SIDE * Math.min(window.devicePixelRatio, 2)));
    stop();
  });

  it('stops following the scroll once stopped', async () => {
    const { track, globe, stop } = await startScene('east');
    stop();
    const before = positionOf(globe, '[data-globe-plane]');

    await scrollToContain(track, FLIGHT_RANGE.end);

    expect(positionOf(globe, '[data-globe-plane]')).toEqual(before);
  });

  it('gives nothing without WebGL2, so the flat arc stays', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(startFlightGlobe(renderScene(), 'east')).toBeNull();
  });
});
