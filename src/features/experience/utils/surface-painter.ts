import { type SurfaceAxes } from '@/features/experience/types/volatility-lab';
import {
  axisPosition,
  type Camera,
  project,
  type Quad,
  type ScreenPoint,
  TICK_OFFSET,
  TITLE_OFFSET,
  type View,
} from '@/features/experience/utils/surface-scene';
import { viridis } from '@/features/experience/utils/viridis';
import { SURFACE_GRID } from '@/features/experience/data/surface-grid';

// The palette's colours the surface is drawn with, read from the tokens on its canvas.
export type SurfaceColors = {
  label: string;
  title: string;
  outline: string;
  grid: string;
  floor: string;
  font: string;
};

type PaintInput = {
  context: CanvasRenderingContext2D;
  camera: Camera;
  view: View;
  quads: readonly Quad[];
  hover: { strike: number; maturity: number } | null;
  colors: SurfaceColors;
  axes: SurfaceAxes;
  pixelRatio: number;
};

const STRIKE_TICKS = [80, 100, 120] as const;
const STRIKE_LINES = [80, 90, 100, 110, 120] as const;
const MATURITY_LINES = [0.5, 1, 1.5] as const;
// A grid line on the surface every fourth cell.
const GRID_EVERY = 4;

function line(context: CanvasRenderingContext2D, from: ScreenPoint, to: ScreenPoint): void {
  context.beginPath();
  context.moveTo(from[0], from[1]);
  context.lineTo(to[0], to[1]);
  context.stroke();
}

function polygon(context: CanvasRenderingContext2D, points: readonly ScreenPoint[]): void {
  context.beginPath();
  for (const [index, [x, y]] of points.entries()) {
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.closePath();
}

const strikeX = (strike: number): number =>
  axisPosition(strike, SURFACE_GRID.strikeMin, SURFACE_GRID.strikeMax);
const maturityZ = (years: number): number =>
  axisPosition(years, SURFACE_GRID.maturityMin, SURFACE_GRID.maturityMax);

// The floor, its grid, the ticks and titles on the two edges nearest the reader, whichever
// way the surface is turned.
function paintFloor({ context, camera, view, colors, axes, pixelRatio }: PaintInput): void {
  const at = (x: number, z: number): ScreenPoint => project(camera, view, x, 0, z);
  polygon(context, [at(-1, -1), at(1, -1), at(1, 1), at(-1, 1)]);
  context.fillStyle = colors.floor;
  context.fill();
  context.lineWidth = pixelRatio;
  context.strokeStyle = colors.outline;
  context.stroke();

  context.lineWidth = 0.75 * pixelRatio;
  context.strokeStyle = colors.grid;
  for (const strike of STRIKE_LINES) {
    line(context, at(strikeX(strike), -1), at(strikeX(strike), 1));
  }
  for (const years of MATURITY_LINES) {
    line(context, at(-1, maturityZ(years)), at(1, maturityZ(years)));
  }

  const strikeSide = at(0, -1)[2] < at(0, 1)[2] ? -1 : 1;
  const maturitySide = at(-1, 0)[2] < at(1, 0)[2] ? -1 : 1;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = colors.label;
  context.font = `500 ${String(11 * pixelRatio)}px ${colors.font}`;
  for (const strike of STRIKE_TICKS) {
    const [x, y] = at(strikeX(strike), strikeSide * TICK_OFFSET);
    context.fillText(String(strike), x, y);
  }
  for (const { years, label } of axes.maturityTicks) {
    const [x, y] = at(maturitySide * TICK_OFFSET, maturityZ(years));
    context.fillText(label, x, y);
  }
  context.fillStyle = colors.title;
  context.font = `600 ${String(11.5 * pixelRatio)}px ${colors.font}`;
  {
    const [x, y] = at(0, strikeSide * TITLE_OFFSET);
    context.fillText(axes.strikeTitle, x, y);
  }
  {
    const [x, y] = at(maturitySide * TITLE_OFFSET, 0);
    context.fillText(axes.maturityTitle, x, y);
  }
}

// Draws the lab's surface: the floor, then the cells from the farthest to the nearest, in
// viridis shaded by the light, and under the pointer, the smile (the same maturity) and the
// term structure (the same strike) of the point read.
export function paintSurface(input: PaintInput): void {
  const { context, quads, hover, colors, pixelRatio } = input;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  paintFloor(input);

  for (const quad of quads) {
    const [red, green, blue] = viridis(quad.level).map((channel) =>
      Math.round(channel * quad.shade),
    );
    const colour = `rgb(${String(red)} ${String(green)} ${String(blue)} / ${String(quad.appear)})`;
    polygon(context, quad.corners);
    context.fillStyle = colour;
    context.fill();
    // The same colour around the cell: no seam between two neighbours.
    context.lineWidth = 0.6 * pixelRatio;
    context.strokeStyle = colour;
    context.stroke();

    const [first, second, , fourth] = quad.corners;
    context.globalAlpha = 0.3 * quad.appear;
    context.lineWidth = 0.7 * pixelRatio;
    context.strokeStyle = colors.floor;
    if (quad.strike % GRID_EVERY === 0) {
      line(context, first, fourth);
    }
    if (quad.maturity % GRID_EVERY === 0) {
      line(context, first, second);
    }
    context.globalAlpha = 1;

    if (hover !== null) {
      context.lineWidth = 1.8 * pixelRatio;
      context.strokeStyle = colors.title;
      if (quad.maturity === hover.maturity) {
        line(context, first, second);
      }
      if (quad.strike === hover.strike) {
        line(context, first, fourth);
      }
    }
  }

  const hovered =
    hover === null
      ? undefined
      : quads.find(
          ({ strike, maturity }) => strike === hover.strike && maturity === hover.maturity,
        );
  if (hovered !== undefined) {
    const [x, y] = hovered.corners[0];
    context.beginPath();
    context.arc(x, y, 4.5 * pixelRatio, 0, Math.PI * 2);
    context.fillStyle = colors.title;
    context.fill();
    context.lineWidth = 2 * pixelRatio;
    context.strokeStyle = colors.floor;
    context.stroke();
  }
}
