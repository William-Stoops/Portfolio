import {
  createSurfaceRenderer,
  type SurfaceRenderer,
} from '@/features/hero/utils/surface-renderer';
import { onThemeChange } from '@/lib/theme-change';
import { parseRgbColor } from '@/utils/parse-rgb-color';

// Everything that runs the hero scene once it is allowed to: loaded on demand with the
// renderer, in its own chunk, so none of it weighs on the initial bundle.

// Canvas pixels per CSS pixel: sharp lines on retina screens, without paying for 3×.
const MAX_PIXEL_RATIO = 2;
// How fast the pointer bump follows the pointer and fades in or out (share per frame).
const POINTER_EASING = 0.08;

// The tints come from the design tokens set on the canvas (text-accent, border-border-input):
// re-read when the theme changes, so the surface follows light and dark.
function applyThemeColors(renderer: SurfaceRenderer, canvas: HTMLCanvasElement): void {
  const style = getComputedStyle(canvas);
  const low = parseRgbColor(style.borderTopColor);
  const high = parseRgbColor(style.color);
  if (low !== null && high !== null) {
    renderer.setColors(low, high);
  }
}

// Draws the surface while the hero is on screen, feeds it the pointer, the scroll and the
// theme, and returns the function that stops and cleans everything. Null without WebGL2:
// the static hero stays.
export function startHeroScene(
  canvas: HTMLCanvasElement,
  { isSettled }: { isSettled: boolean },
): (() => void) | null {
  const renderer = createSurfaceRenderer(canvas, isSettled ? 'centre' : 'right');
  return renderer === null ? null : runScene(renderer, canvas, isSettled);
}

// A settled scene (the finale) keeps a calm surface instead of flattening with the scroll.
const SETTLED_CALM = 0.45;
// The hero's opening (ADR 0030): the camera flies in over the surface as it rises, then
// lands behind the name; as the hero scrolls away it dives among the waves, faster and
// faster, the surface only a little calmer.
const INTRO_DURATION = 2800;
const SCROLL_CALM = 0.3;
// The relief the surface rises from, as a share of its full height.
const FLAT_RELIEF = 0.25;

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

function runScene(
  renderer: SurfaceRenderer,
  canvas: HTMLCanvasElement,
  isSettled: boolean,
): () => void {
  const startTime = performance.now();
  let frameHandle = 0;
  let isVisible = true;
  let pointerTarget: readonly [number, number] | null = null;
  let pointer: [number, number] = [0, 0];
  let pointerStrength = 0;
  let parallax = 0;
  let ripple: { origin: readonly [number, number]; startTime: number } | null = null;
  // The first frame's time: the fly-in starts when the surface is first drawn.
  let introStart: number | null = null;

  function resize(): void {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    renderer.resize(
      Math.round(canvas.clientWidth * pixelRatio),
      Math.round(canvas.clientHeight * pixelRatio),
      pixelRatio,
    );
  }

  function frame(now: number): void {
    const hasTarget = pointerTarget !== null;
    if (pointerTarget !== null) {
      pointer = [
        pointer[0] + (pointerTarget[0] - pointer[0]) * POINTER_EASING,
        pointer[1] + (pointerTarget[1] - pointer[1]) * POINTER_EASING,
      ];
    }
    pointerStrength += ((hasTarget ? 1 : 0) - pointerStrength) * POINTER_EASING;
    introStart ??= now;
    const intro = isSettled ? 1 : easeOutCubic(Math.min((now - introStart) / INTRO_DURATION, 1));
    if (intro === 1 && canvas.dataset['landed'] === undefined) {
      // Tells the page (and the tests) the camera has landed.
      canvas.dataset['landed'] = '';
    }
    const scroll = Math.min(window.scrollY / Math.max(canvas.clientHeight, 1), 1);
    renderer.draw({
      time: (now - startTime) / 1000,
      pointer,
      pointerStrength,
      calm: isSettled ? SETTLED_CALM : SCROLL_CALM * scroll,
      parallax,
      ripple:
        ripple === null ? null : { origin: ripple.origin, age: (now - ripple.startTime) / 1000 },
      intro,
      // Slow at first, then faster: a plunge.
      dive: isSettled ? 0 : scroll ** 2,
      rise: FLAT_RELIEF + (1 - FLAT_RELIEF) * intro,
    });
    frameHandle = window.requestAnimationFrame(frame);
  }

  function setRunning(shouldRun: boolean): void {
    window.cancelAnimationFrame(frameHandle);
    if (shouldRun) {
      frameHandle = window.requestAnimationFrame(frame);
    }
  }

  function handlePointerMove(event: PointerEvent): void {
    const { left, top, width, height } = canvas.getBoundingClientRect();
    const screenX = ((event.clientX - left) / width) * 2 - 1;
    const screenY = 1 - ((event.clientY - top) / height) * 2;
    parallax = Math.max(-1, Math.min(1, screenX));
    pointerTarget = renderer.groundUnder(screenX, screenY);
  }

  function handlePointerDown(event: PointerEvent): void {
    const { left, top, width, height } = canvas.getBoundingClientRect();
    const screenX = ((event.clientX - left) / width) * 2 - 1;
    const screenY = 1 - ((event.clientY - top) / height) * 2;
    if (Math.abs(screenX) > 1 || Math.abs(screenY) > 1) {
      return;
    }
    const origin = renderer.groundUnder(screenX, screenY);
    if (origin !== null) {
      ripple = { origin, startTime: performance.now() };
    }
  }

  function handlePointerLeave(): void {
    pointerTarget = null;
  }

  function handleThemeChange(): void {
    applyThemeColors(renderer, canvas);
  }

  resize();
  applyThemeColors(renderer, canvas);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  // No frame is drawn while the hero is off screen.
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry?.isIntersecting ?? false;
    setRunning(isVisible);
  });
  intersectionObserver.observe(canvas);
  const stopThemeWatch = onThemeChange(handleThemeChange);
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  document.documentElement.addEventListener('pointerleave', handlePointerLeave);
  setRunning(isVisible);

  return () => {
    setRunning(false);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    stopThemeWatch();
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerdown', handlePointerDown);
    document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    renderer.dispose();
  };
}
