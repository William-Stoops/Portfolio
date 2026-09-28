import { FLIGHT_PLACES } from '@/features/korea/data/flight-places';
import { type FlightDirection } from '@/features/korea/types/flight-direction';
import { flightMoment, sceneProgress } from '@/features/korea/utils/flight-timeline';
import {
  facingRotation,
  type GlobeRoute,
  projectOnGlobe,
  routePoint,
  toCartesian,
  viewCentre,
} from '@/features/korea/utils/globe-geometry';
import { createGlobeRenderer, type GlobeRenderer } from '@/features/korea/utils/globe-renderer';
import { onThemeChange } from '@/lib/theme-change';
import { parseRgbColor } from '@/utils/parse-rgb-color';

// Everything that runs the globe once it is allowed to: loaded on demand with the renderer
// and the map, in its own chunk, so none of it weighs on the page until the voyage nears.

// Canvas pixels per CSS pixel: crisp dots on retina screens, without paying for 3×.
const MAX_PIXEL_RATIO = 2;
// A step along the route, to read the plane's heading on screen.
const HEADING_STEP = 0.01;
// The icon's nose points up and to the right.
const ICON_HEADING = 45;
// Scroll events are only followed while the scene is this close to the viewport.
const ACTIVE_MARGIN = '200px';

type Overlay = { plane: HTMLElement; origin: HTMLElement; destination: HTMLElement };

function htmlElement(root: Element, selector: string): HTMLElement | null {
  const element = root.querySelector(selector);
  return element instanceof HTMLElement ? element : null;
}

// The tints come from the design tokens set on the canvas (see FlightGlobe): read again
// when the theme changes, so the globe follows light and dark.
function applyTints(renderer: GlobeRenderer, canvas: HTMLCanvasElement): void {
  const style = getComputedStyle(canvas);
  const land = parseRgbColor(style.borderTopColor);
  const route = parseRgbColor(style.textDecorationColor);
  const flownRoute = parseRgbColor(style.color);
  if (land !== null && route !== null && flownRoute !== null) {
    renderer.setTints({ land, route, flownRoute });
  }
}

// Puts an overlay element on a point of the canvas; it hides behind the horizon.
function pin(
  element: HTMLElement,
  { x, y, isFacing }: { x: number; y: number; isFacing: boolean },
  side: number,
): void {
  element.style.translate = `${String(x * side)}px ${String(y * side)}px`;
  element.style.opacity = isFacing ? '1' : '0';
}

// Draws the globe of a flight scene as its track scrolls by (the scene pinned, the globe
// turning, the plane flying the route), and returns the function that stops and cleans
// everything. Null without WebGL2 or without its elements: the flat arc stays.
export function startFlightGlobe(
  { globe, track }: { globe: HTMLElement; track: HTMLElement },
  direction: FlightDirection,
): (() => void) | null {
  const canvas = globe.querySelector('canvas');
  const plane = htmlElement(globe, '[data-globe-plane]');
  const origin = htmlElement(globe, '[data-globe-place="origin"]');
  const destination = htmlElement(globe, '[data-globe-place="destination"]');
  if (canvas === null || plane === null || origin === null || destination === null) {
    return null;
  }
  const [from, to] =
    direction === 'east'
      ? [FLIGHT_PLACES.france, FLIGHT_PLACES.seoul]
      : [FLIGHT_PLACES.seoul, FLIGHT_PLACES.france];
  const route = { from: toCartesian(from), to: toCartesian(to) };
  const renderer = createGlobeRenderer(canvas, route);
  return renderer === null
    ? null
    : runGlobe(renderer, { canvas, track, route, overlay: { plane, origin, destination } });
}

function runGlobe(
  renderer: GlobeRenderer,
  {
    canvas,
    track,
    route,
    overlay,
  }: {
    canvas: HTMLCanvasElement;
    track: HTMLElement;
    route: GlobeRoute;
    overlay: Overlay;
  },
): () => void {
  let frameHandle = 0;
  let isActive = false;

  function draw(): void {
    frameHandle = 0;
    const { entry, contain } = sceneProgress(track.getBoundingClientRect(), window.innerHeight);
    const { flown, planeScale } = flightMoment(contain);
    const rotation = facingRotation(viewCentre(route, flown, entry));
    renderer.draw({ rotation, flown });

    const side = canvas.clientWidth;
    pin(overlay.origin, projectOnGlobe(route.from, rotation), side);
    pin(overlay.destination, projectOnGlobe(route.to, rotation), side);
    const behind = projectOnGlobe(routePoint(route, flown - HEADING_STEP), rotation);
    const ahead = projectOnGlobe(routePoint(route, flown + HEADING_STEP), rotation);
    const heading = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
    pin(overlay.plane, projectOnGlobe(routePoint(route, flown), rotation), side);
    overlay.plane.style.rotate = `${String(heading + ICON_HEADING)}deg`;
    overlay.plane.style.scale = String(planeScale);
  }

  function requestDraw(): void {
    if (isActive && frameHandle === 0) {
      frameHandle = window.requestAnimationFrame(draw);
    }
  }

  function resize(): void {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    renderer.resize(Math.round(canvas.clientWidth * pixelRatio));
    requestDraw();
  }

  function handleThemeChange(): void {
    applyTints(renderer, canvas);
    requestDraw();
  }

  applyTints(renderer, canvas);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  // The scroll is followed only while the scene is near: elsewhere nothing is computed.
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isActive = entry?.isIntersecting ?? false;
      requestDraw();
    },
    { rootMargin: ACTIVE_MARGIN },
  );
  intersectionObserver.observe(track);
  const stopThemeWatch = onThemeChange(handleThemeChange);
  window.addEventListener('scroll', requestDraw, { passive: true });

  return () => {
    window.cancelAnimationFrame(frameHandle);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    stopThemeWatch();
    window.removeEventListener('scroll', requestDraw);
    renderer.dispose();
  };
}
