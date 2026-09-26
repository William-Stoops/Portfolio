import { parseRgbColor } from '@/features/hero/utils/scene-support';
import {
  createSurfaceRenderer,
  type SurfaceRenderer,
} from '@/features/hero/utils/surface-renderer';

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
export function startHeroScene(canvas: HTMLCanvasElement): (() => void) | null {
  const renderer = createSurfaceRenderer(canvas);
  return renderer === null ? null : runScene(renderer, canvas);
}

function runScene(renderer: SurfaceRenderer, canvas: HTMLCanvasElement): () => void {
  const startTime = performance.now();
  let frameHandle = 0;
  let isVisible = true;
  let pointerTarget: readonly [number, number] | null = null;
  let pointer: [number, number] = [0, 0];
  let pointerStrength = 0;
  let parallax = 0;

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
    renderer.draw({
      time: (now - startTime) / 1000,
      pointer,
      pointerStrength,
      calm: Math.min(window.scrollY / Math.max(canvas.clientHeight, 1), 1),
      parallax,
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
  const themeObserver = new MutationObserver(handleThemeChange);
  themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  colorScheme.addEventListener('change', handleThemeChange);
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', handlePointerLeave);
  setRunning(isVisible);

  return () => {
    setRunning(false);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    colorScheme.removeEventListener('change', handleThemeChange);
    window.removeEventListener('pointermove', handlePointerMove);
    document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    renderer.dispose();
  };
}
