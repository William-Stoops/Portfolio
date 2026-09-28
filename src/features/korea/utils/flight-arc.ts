// The flight from France to Seoul, drawn in an SVG 1000 units wide by 300 high: a circle
// arc bulging north, like the great circle it stands for. The plane hangs on an arm that
// turns around the circle's centre, so a single rotation (on the compositor) moves it
// along the arc and keeps it facing its way.
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 300;
const START_X = 80;
const END_X = 920;
const BASE_Y = 260;
const APEX_Y = 60;

const HALF_CHORD = (END_X - START_X) / 2;
const SAGITTA = BASE_Y - APEX_Y;
const RADIUS = (HALF_CHORD ** 2 + SAGITTA ** 2) / (2 * SAGITTA);
const CENTRE_Y = APEX_Y + RADIUS;
const HALF_ANGLE = (Math.asin(HALF_CHORD / RADIUS) * 180) / Math.PI;

// The SVG spans the container's width: one unit is 100 / VIEW_WIDTH cqi.
function toContainerUnits(units: number): string {
  return `${String(Number(((units * 100) / VIEW_WIDTH).toFixed(1)))}cqi`;
}

function toWidthPercent(x: number): string {
  return `${String((x * 100) / VIEW_WIDTH)}%`;
}

export const FLIGHT_ARC = {
  viewWidth: VIEW_WIDTH,
  // The circle the arc belongs to, in the SVG's units.
  circle: { centreX: (START_X + END_X) / 2, centreY: CENTRE_Y, radius: RADIUS },
  viewBox: `0 0 ${String(VIEW_WIDTH)} ${String(VIEW_HEIGHT)}`,
  path: `M${String(START_X)} ${String(BASE_Y)}A${String(RADIUS)} ${String(RADIUS)} 0 0 1 ${String(END_X)} ${String(BASE_Y)}`,
  start: { x: START_X, y: BASE_Y },
  end: { x: END_X, y: BASE_Y },
  pivotTop: toContainerUnits(CENTRE_Y),
  // The plane (2.5rem) centred on the arc, one radius above the pivot.
  planeTop: `calc(-${toContainerUnits(RADIUS)} - 1.25rem)`,
  halfAngle: `${HALF_ANGLE.toFixed(1)}deg`,
  startLeft: toWidthPercent(START_X),
  endLeft: toWidthPercent(END_X),
  // Under the ends of the arc, a little below them.
  labelTop: `calc(${((BASE_Y * 100) / VIEW_HEIGHT).toFixed(3)}% + 1rem)`,
} as const;
