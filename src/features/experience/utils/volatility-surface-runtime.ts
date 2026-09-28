import { type SurfaceAxes, type SurfaceReading } from '@/features/experience/types/volatility-lab';
import { paintSurface, type SurfaceColors } from '@/features/experience/utils/surface-painter';
import {
  buildQuads,
  type Camera,
  clampPitch,
  DEFAULT_CAMERA,
  fitView,
  INTRO_CAMERA,
  pickQuad,
  type Quad,
  type View,
} from '@/features/experience/utils/surface-scene';
import {
  marketPrices,
  maturityAt,
  sigmaAt,
  solveSurface,
  strikeAt,
  type VolatilitySurface,
} from '@/features/experience/utils/volatility-grid';
import { onThemeChange } from '@/lib/theme-change';

// Everything that runs the lab once its section nears: loaded on demand, in its own chunk.

type SurfaceOptions = {
  axes: SurfaceAxes;
  // The lab's buttons: each carries the turn it makes (data-turn); the arrow keys turn the
  // surface too while one of them has the focus.
  controls: HTMLElement;
  // Reduced motion: the surface is drawn at once, where it rests.
  isStill: boolean;
  onMeasured: (milliseconds: number) => void;
  onReadout: (reading: SurfaceReading | null) => void;
};

// The solve is timed until the clock is meaningful: a surface takes about a millisecond.
const MEASURE_MS = 8;
const MAX_PIXEL_RATIO = 2;
// Room around the surface for its ticks and titles, centred on their anchor: a share of the
// canvas, never less than half the widest title, in CSS pixels.
const MARGIN = { share: 0.055, leastX: 40, leastY: 20 };
const INTRO_MS = 2500;
const DRAG = { yaw: 0.008, pitch: 0.006 };
const TURNS: Readonly<Record<string, Camera>> = {
  left: { yaw: -0.12, pitch: 0 },
  right: { yaw: 0.12, pitch: 0 },
  up: { yaw: 0, pitch: 0.08 },
  down: { yaw: 0, pitch: -0.08 },
};
const KEY_TURNS: Readonly<Record<string, string>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const easeOut = (value: number): number => 1 - (1 - value) ** 3;
const easeInOut = (value: number): number =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

function solveTimed(): { surface: VolatilitySurface; milliseconds: number } {
  const prices = marketPrices();
  const start = performance.now();
  let surface = solveSurface(prices);
  let runs = 1;
  while (performance.now() - start < MEASURE_MS) {
    surface = solveSurface(prices);
    runs += 1;
  }
  return { surface, milliseconds: (performance.now() - start) / runs };
}

// The tokens set on the canvas (see VolatilityLab): read again when the theme changes.
function readColors(canvas: HTMLCanvasElement): SurfaceColors {
  const style = getComputedStyle(canvas);
  return {
    label: style.color,
    outline: style.borderTopColor,
    title: style.borderRightColor,
    grid: style.borderBottomColor,
    floor: style.borderLeftColor,
    font: style.fontFamily,
  };
}

// Solves the lab's surface in the visitor's browser, says how long it took, draws it (rising
// from a heat map unless motion is unwelcome), lets it turn with the pointer or the arrows
// and reads the point under the pointer. Returns the function that stops everything; null
// without a 2D canvas.
export function startVolatilitySurface(
  canvas: HTMLCanvasElement,
  { axes, controls, isStill, onMeasured, onReadout }: SurfaceOptions,
): (() => void) | null {
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const { surface, milliseconds } = solveTimed();
  onMeasured(milliseconds);

  let colors = readColors(canvas);
  let pixelRatio = 1;
  let view: View = { scale: 1, x: 0, y: 0 };
  const camera: Camera = isStill ? { ...DEFAULT_CAMERA } : { ...INTRO_CAMERA };
  let lift = isStill ? 1 : 0;
  let sweep = isStill ? 1 : 0;
  let quads: Quad[] = [];
  let hover: { strike: number; maturity: number } | null = null;
  let drag: { x: number; y: number; from: Camera } | null = null;
  let hasTakenOver = false;
  let frame = 0;
  let intro = 0;

  function draw(): void {
    if (context === null) {
      return;
    }
    quads = buildQuads(surface, camera, view, { lift, sweep });
    paintSurface({ context, camera, view, quads, hover, colors, axes, pixelRatio });
  }

  function requestDraw(): void {
    if (frame === 0) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
    }
  }

  function fit(): void {
    pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
    view = fitView(surface, canvas.width, canvas.height, {
      x: Math.max(MARGIN.leastX * pixelRatio, canvas.width * MARGIN.share),
      y: Math.max(MARGIN.leastY * pixelRatio, canvas.height * MARGIN.share * 1.4),
    });
    draw();
  }

  function read(quad: Quad | null): void {
    hover = quad === null ? null : { strike: quad.strike, maturity: quad.maturity };
    onReadout(
      quad === null
        ? null
        : {
            sigma: sigmaAt(surface, quad.strike, quad.maturity),
            strike: strikeAt(quad.strike),
            maturity: maturityAt(quad.maturity),
          },
    );
    requestDraw();
  }

  function pickAt(event: PointerEvent | MouseEvent): Quad | null {
    const box = canvas.getBoundingClientRect();
    return pickQuad(
      quads,
      (event.clientX - box.left) * pixelRatio,
      (event.clientY - box.top) * pixelRatio,
    );
  }

  function handlePointerDown(event: PointerEvent): void {
    hasTakenOver = true;
    drag = { x: event.clientX, y: event.clientY, from: { ...camera } };
    canvas.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (drag !== null) {
      camera.yaw = drag.from.yaw + (event.clientX - drag.x) * DRAG.yaw;
      camera.pitch = clampPitch(drag.from.pitch + (event.clientY - drag.y) * DRAG.pitch);
      requestDraw();
      return;
    }
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      read(pickAt(event));
    }
  }

  function handlePointerUp(): void {
    drag = null;
  }

  function handlePointerLeave(): void {
    if (drag === null) {
      read(null);
    }
  }

  // A tap reads the point, where there is no hover.
  function handleClick(event: MouseEvent): void {
    const quad = pickAt(event);
    if (quad !== null) {
      read(quad);
    }
  }

  function turn(name: string | undefined): boolean {
    const step = name === undefined ? undefined : TURNS[name];
    if (step === undefined) {
      return false;
    }
    hasTakenOver = true;
    camera.yaw += step.yaw;
    camera.pitch = clampPitch(camera.pitch + step.pitch);
    requestDraw();
    return true;
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (turn(KEY_TURNS[event.key])) {
      event.preventDefault();
    }
  }

  function handleControlClick(event: MouseEvent): void {
    const button = event.target instanceof Element ? event.target.closest('[data-turn]') : null;
    if (button instanceof HTMLElement) {
      turn(button.dataset['turn']);
    }
  }

  // The intro, under three seconds: the values fill the grid seen from above, then the
  // camera tilts while the surface rises. The reader may take the camera at any moment.
  function playIntro(): void {
    const born = performance.now();
    const step = (now: number): void => {
      const elapsed = now - born;
      sweep = clamp01((elapsed - 150) / 900);
      lift = easeOut(clamp01((elapsed - 850) / 1400));
      if (!hasTakenOver) {
        const progress = easeInOut(clamp01((elapsed - 700) / 1700));
        camera.pitch = INTRO_CAMERA.pitch + (DEFAULT_CAMERA.pitch - INTRO_CAMERA.pitch) * progress;
        camera.yaw = INTRO_CAMERA.yaw + (DEFAULT_CAMERA.yaw - INTRO_CAMERA.yaw) * progress;
      }
      draw();
      intro = elapsed < INTRO_MS ? requestAnimationFrame(step) : 0;
    };
    intro = requestAnimationFrame(step);
  }

  const resizing = new ResizeObserver(fit);
  const stopFollowingTheme = onThemeChange(() => {
    colors = readColors(canvas);
    requestDraw();
  });
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointercancel', handlePointerUp);
  canvas.addEventListener('pointerleave', handlePointerLeave);
  canvas.addEventListener('click', handleClick);
  controls.addEventListener('keydown', handleKeyDown);
  controls.addEventListener('click', handleControlClick);
  resizing.observe(canvas);
  fit();
  if (!isStill) {
    playIntro();
  }

  return () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(intro);
    resizing.disconnect();
    stopFollowingTheme();
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointermove', handlePointerMove);
    canvas.removeEventListener('pointerup', handlePointerUp);
    canvas.removeEventListener('pointercancel', handlePointerUp);
    canvas.removeEventListener('pointerleave', handlePointerLeave);
    canvas.removeEventListener('click', handleClick);
    controls.removeEventListener('keydown', handleKeyDown);
    controls.removeEventListener('click', handleControlClick);
  };
}
