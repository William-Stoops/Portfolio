import { type Vector3 } from '@/utils/matrix4';

// Where the camera of the hero's surface stands and looks, kept out of the WebGL code so it
// can be unit-tested. At rest it sways slowly and leans with the pointer; it flies in over
// the surface as the scene starts (`intro`, 0 to 1), and dives among the waves as the hero
// scrolls away (`dive`, 0 to 1): the opening of the page (ADR 0030).

// right: the hero, the surface beside the portrait, away from the text column.
// centre: the finale, the surface across the width, seen from a little higher.
export type SurfaceFraming = 'right' | 'centre';

type CameraPose = { eye: Vector3; target: Vector3; fieldOfView: number };

const REST_TARGETS: Readonly<Record<SurfaceFraming, Vector3>> = {
  right: [-1.6, 0.45, -0.5],
  centre: [0, 0.2, -0.6],
};
const REST_EYE_HEIGHT = 1.25;
const REST_EYE_DEPTH = 4.3;
const FIELD_OF_VIEW = 0.8;

// The fly-in starts high above and far behind the surface, looking down its length.
const APPROACH_EYE: Vector3 = [0, 4.2, 10.5];
const APPROACH_TARGET: Vector3 = [0, 0, -1.5];
// The dive ends down among the waves, looking ahead, the view a little wider.
const DIVE_EYE_HEIGHT = 0.35;
const DIVE_EYE_DEPTH = 1.4;
const DIVE_TARGET_HEIGHT = 0.05;
const DIVE_TARGET_DEPTH = -3;
const DIVE_WIDENING = 0.25;

function mix(from: Vector3, to: Vector3, share: number): Vector3 {
  return [
    from[0] + (to[0] - from[0]) * share,
    from[1] + (to[1] - from[1]) * share,
    from[2] + (to[2] - from[2]) * share,
  ];
}

export function heroCamera(
  framing: SurfaceFraming,
  { time, parallax, intro, dive }: { time: number; parallax: number; intro: number; dive: number },
): CameraPose {
  const sway = 0.5 * Math.sin(time * 0.12) + 0.35 * parallax;
  const restTarget = REST_TARGETS[framing];
  const arrivedEye = mix(APPROACH_EYE, [sway, REST_EYE_HEIGHT, REST_EYE_DEPTH], intro);
  const arrivedTarget = mix(APPROACH_TARGET, restTarget, intro);
  return {
    eye: mix(arrivedEye, [sway, DIVE_EYE_HEIGHT, DIVE_EYE_DEPTH], dive),
    target: mix(arrivedTarget, [restTarget[0], DIVE_TARGET_HEIGHT, DIVE_TARGET_DEPTH], dive),
    fieldOfView: FIELD_OF_VIEW + DIVE_WIDENING * dive,
  };
}
