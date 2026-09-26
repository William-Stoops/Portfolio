import { FLIGHT_ARC } from '@/features/korea/utils/flight-arc';

// A flight scene on large screens: the route spans most of the scene and the flag waits at
// its landing, the arc ending on the flag's centre: on the right flying east (the voyage to
// Seoul), on the left flying west (the way home). Widths are shares of the scene; heights
// are in its container units (the scene's width), so the whole scene scales as one.
const ROUTE_WIDTH = 90;
const FLAG_WIDTH = 32;
const FLAG_ASPECT = 3 / 2;
// The route is drawn 1000 units wide by 300 high, at the route's width.
const ROUTE_ASPECT = 1000 / 300;

const SCALE = ROUTE_WIDTH / FLIGHT_ARC.viewWidth;
const LANDING_Y = FLIGHT_ARC.end.y * SCALE;
const FLAG_HEIGHT = FLAG_WIDTH / FLAG_ASPECT;
const FLAG_TOP = LANDING_Y - FLAG_HEIGHT / 2;

// Where the arc meets the top of the flag, in the route's units: the dotted line stops
// there, and the plane flies the rest over the field. West mirrors east.
const FLAG_TOP_UNITS = FLAG_TOP / SCALE;
const CIRCLE = FLIGHT_ARC.circle;
const ENTRY_OFFSET = Math.sqrt(CIRCLE.radius ** 2 - (CIRCLE.centreY - FLAG_TOP_UNITS) ** 2);

function format(value: number): string {
  return String(Number(value.toFixed(3)));
}

function arcToFlag(direction: 'east' | 'west'): string {
  const [from, entryX, sweep] =
    direction === 'east'
      ? [FLIGHT_ARC.start, CIRCLE.centreX + ENTRY_OFFSET, 1]
      : [FLIGHT_ARC.end, CIRCLE.centreX - ENTRY_OFFSET, 0];
  return `M${format(from.x)} ${format(from.y)}A${format(CIRCLE.radius)} ${format(CIRCLE.radius)} 0 0 ${String(sweep)} ${entryX.toFixed(1)} ${FLAG_TOP_UNITS.toFixed(1)}`;
}

function layout(direction: 'east' | 'west') {
  const routeLeft = direction === 'east' ? 0 : 100 - ROUTE_WIDTH;
  const landing = direction === 'east' ? FLIGHT_ARC.end.x : FLIGHT_ARC.start.x;
  return {
    routeLeft: `${format(routeLeft)}%`,
    routeWidth: `${format(ROUTE_WIDTH)}%`,
    flagWidth: `${format(FLAG_WIDTH)}%`,
    flagLeft: `${format(routeLeft + landing * SCALE - FLAG_WIDTH / 2)}%`,
    flagTop: `${format(FLAG_TOP)}cqi`,
    arcToFlag: arcToFlag(direction),
    sceneHeight: `${format(Math.max(ROUTE_WIDTH / ROUTE_ASPECT, FLAG_TOP + FLAG_HEIGHT))}cqi`,
  } as const;
}

export const SCENE_LAYOUTS = { east: layout('east'), west: layout('west') } as const;
