import { FLIGHT_ARC } from '@/features/korea/utils/flight-arc';

// The voyage on large screens: the route spans most of the stage and the flag waits at its
// end, the arc landing on the taegeuk's centre. Widths are shares of the stage; heights
// are in its container units (the stage's width), so the whole scene scales as one.
const ROUTE_WIDTH = 90;
const FLAG_WIDTH = 32;
const FLAG_ASPECT = 3 / 2;
// The route is drawn 1000 units wide by 300 high, at the route's width.
const ROUTE_ASPECT = 1000 / 300;

const SCALE = ROUTE_WIDTH / FLIGHT_ARC.viewWidth;
const LANDING_X = FLIGHT_ARC.end.x * SCALE;
const LANDING_Y = FLIGHT_ARC.end.y * SCALE;
const FLAG_HEIGHT = FLAG_WIDTH / FLAG_ASPECT;
const FLAG_TOP = LANDING_Y - FLAG_HEIGHT / 2;

// Where the arc meets the top of the flag, in the route's units: the dotted line stops
// there, and the plane flies the rest over the field.
const FLAG_TOP_UNITS = FLAG_TOP / SCALE;
const CIRCLE = FLIGHT_ARC.circle;
const ENTRY_X =
  CIRCLE.centreX + Math.sqrt(CIRCLE.radius ** 2 - (CIRCLE.centreY - FLAG_TOP_UNITS) ** 2);

function format(value: number): string {
  return String(Number(value.toFixed(3)));
}

export const VOYAGE_LAYOUT = {
  routeWidth: `${format(ROUTE_WIDTH)}%`,
  flagWidth: `${format(FLAG_WIDTH)}%`,
  flagLeft: `${format(LANDING_X - FLAG_WIDTH / 2)}%`,
  flagTop: `${format(FLAG_TOP)}cqi`,
  arcToFlag: `M${format(FLIGHT_ARC.start.x)} ${format(FLIGHT_ARC.start.y)}A${format(CIRCLE.radius)} ${format(CIRCLE.radius)} 0 0 1 ${ENTRY_X.toFixed(1)} ${FLAG_TOP_UNITS.toFixed(1)}`,
  sceneHeight: `${format(Math.max(ROUTE_WIDTH / ROUTE_ASPECT, FLAG_TOP + FLAG_HEIGHT))}cqi`,
} as const;
