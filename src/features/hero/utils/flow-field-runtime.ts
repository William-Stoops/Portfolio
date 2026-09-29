import { createFlowRenderer, type FlowTints } from '@/features/hero/utils/flow-field-renderer';
import { onThemeChange } from '@/lib/theme-change';
import { parseRgbColor } from '@/utils/parse-rgb-color';

// Everything that runs the hero's field once it is allowed to: loaded on demand, in its own
// chunk, after the page is up.

// A field of soft colour needs few pixels: half the canvas's size on screen, stretched.
const RESOLUTION = 0.5;
// Where the noise starts: a moment where the four tints all show.
const TIME_OFFSET = 40;

// The four tints come from the design tokens set on the canvas (see FlowField): read again
// when the theme changes, so the field follows light and dark.
function readTints(canvas: HTMLCanvasElement): FlowTints | null {
  const style = getComputedStyle(canvas);
  const sky = parseRgbColor(style.color);
  const blue = parseRgbColor(style.borderTopColor);
  const violet = parseRgbColor(style.borderRightColor);
  const peach = parseRgbColor(style.borderBottomColor);
  return sky === null || blue === null || violet === null || peach === null
    ? null
    : { sky, blue, violet, peach };
}

// Draws the field on its canvas while it is on screen, and returns the function that stops
// and cleans everything. Null without WebGL2: the still gradient stays.
export function startFlowField(canvas: HTMLCanvasElement): (() => void) | null {
  const renderer = createFlowRenderer(canvas);
  if (renderer === null) {
    return null;
  }

  function applyTints(): void {
    const tints = readTints(canvas);
    if (renderer !== null && tints !== null) {
      renderer.setTints(tints);
    }
  }

  function fit(): void {
    renderer?.resize(
      Math.max(1, Math.round(canvas.clientWidth * RESOLUTION)),
      Math.max(1, Math.round(canvas.clientHeight * RESOLUTION)),
    );
  }

  const start = performance.now();
  let frame = 0;
  let isOnScreen = true;

  function tick(now: number): void {
    renderer?.draw((now - start) / 1000 + TIME_OFFSET);
    frame = isOnScreen ? requestAnimationFrame(tick) : 0;
  }

  // Off screen, the field stops drawing; back on screen, it picks up where time has gone.
  const visibility = new IntersectionObserver((entries) => {
    isOnScreen = entries.some((entry) => entry.isIntersecting);
    if (isOnScreen && frame === 0) {
      frame = requestAnimationFrame(tick);
    }
  });
  const resizing = new ResizeObserver(fit);
  const stopFollowingTheme = onThemeChange(applyTints);

  applyTints();
  fit();
  visibility.observe(canvas);
  resizing.observe(canvas);
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    visibility.disconnect();
    resizing.disconnect();
    stopFollowingTheme();
    renderer.dispose();
  };
}
