import { LAND_DOTS } from '@/features/korea/data/land-dots';
import {
  GLOBE_VIEW_PROJECTION,
  type GlobeRoute,
  HORIZON,
  sampleRoute,
  toCartesian,
} from '@/features/korea/utils/globe-geometry';
import { landPoints } from '@/features/korea/utils/land-dots';
import { createShaderProgram } from '@/lib/webgl-program';
import { type Matrix4 } from '@/utils/matrix4';
import { type RgbChannels } from '@/utils/parse-rgb-color';

// The globe of the voyage, in raw WebGL2 like the hero's surface: the continents as dots
// (Natural Earth, data/land-dots.ts), the route as a dotted arc above them, flown part
// lit. One buffer, one draw call; the CPU sends a rotation and the share flown per frame.

// Dots along the route: close enough to read as a dotted line.
const ROUTE_SAMPLES = 96;

// Each point: x, y, z, and the share of the route it stands at (land: -1).
const VERTEX_SHADER = `#version 300 es
in vec4 a_point;
uniform mat4 u_viewProjection;
uniform mat4 u_rotation;
uniform float u_flown;
uniform float u_pointSize;
out float v_facing;
out float v_kind;

void main() {
  vec4 turned = u_rotation * vec4(a_point.xyz, 1.0);
  // From the horizon (0) to the middle of the globe (1): dots fade out towards the limb.
  v_facing = (turned.z / length(turned.xyz) - ${String(HORIZON)}) / ${String(1 - HORIZON)};
  // 0: land; 1: the route ahead of the plane; 2: the route flown.
  v_kind = a_point.w < 0.0 ? 0.0 : (a_point.w <= u_flown ? 2.0 : 1.0);
  gl_Position = u_viewProjection * turned;
  float size = v_kind == 0.0 ? 1.0 : (v_kind == 2.0 ? 1.7 : 1.25);
  gl_PointSize = u_pointSize * size * mix(0.5, 1.0, clamp(v_facing * 2.0, 0.0, 1.0));
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
uniform vec3 u_land;
uniform vec3 u_route;
uniform vec3 u_flownRoute;
in float v_facing;
in float v_kind;
out vec4 color;

void main() {
  if (v_facing <= 0.0) {
    discard;
  }
  float edge = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - 0.5));
  float alpha = edge * smoothstep(0.0, 0.3, v_facing) * (v_kind == 0.0 ? 0.75 : 1.0);
  vec3 tint = v_kind == 0.0 ? u_land : (v_kind == 2.0 ? u_flownRoute : u_route);
  color = vec4(tint * alpha, alpha);
}`;

type GlobeTints = { land: RgbChannels; route: RgbChannels; flownRoute: RgbChannels };

export type GlobeRenderer = {
  // Size in device pixels (the canvas is square).
  resize: (side: number) => void;
  setTints: (tints: GlobeTints) => void;
  draw: (frame: { rotation: Matrix4; flown: number }) => void;
  dispose: () => void;
};

function buildPoints(route: GlobeRoute): Float32Array {
  const land = landPoints(LAND_DOTS);
  const points = new Float32Array(land.length * 4 + ROUTE_SAMPLES * 4);
  land.forEach((place, index) => {
    points.set([...toCartesian(place), -1], index * 4);
  });
  points.set(sampleRoute(route, ROUTE_SAMPLES), land.length * 4);
  return points;
}

// Null when the browser has no WebGL2 or the shaders do not build: the flat arc stays.
export function createGlobeRenderer(
  canvas: HTMLCanvasElement,
  route: GlobeRoute,
): GlobeRenderer | null {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
  if (gl === null) {
    return null;
  }
  const program = createShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  if (program === null) {
    return null;
  }

  const points = buildPoints(route);
  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  const pointLocation = gl.getAttribLocation(program, 'a_point');
  gl.enableVertexAttribArray(pointLocation);
  gl.vertexAttribPointer(pointLocation, 4, gl.FLOAT, false, 0, 0);

  const uniform = (name: string): WebGLUniformLocation | null =>
    gl.getUniformLocation(program, name);
  const locations = {
    viewProjection: uniform('u_viewProjection'),
    rotation: uniform('u_rotation'),
    flown: uniform('u_flown'),
    pointSize: uniform('u_pointSize'),
    land: uniform('u_land'),
    route: uniform('u_route'),
    flownRoute: uniform('u_flownRoute'),
  };

  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.uniformMatrix4fv(locations.viewProjection, false, GLOBE_VIEW_PROJECTION);

  return {
    resize(side) {
      canvas.width = side;
      canvas.height = side;
      gl.viewport(0, 0, side, side);
      // Dots scale with the globe: the continents keep their texture at every size.
      gl.uniform1f(locations.pointSize, side * 0.0058);
    },
    setTints({ land, route: ahead, flownRoute }) {
      gl.uniform3f(locations.land, ...land);
      gl.uniform3f(locations.route, ...ahead);
      gl.uniform3f(locations.flownRoute, ...flownRoute);
    },
    draw({ rotation, flown }) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(locations.rotation, false, rotation);
      gl.uniform1f(locations.flown, flown);
      gl.drawArrays(gl.POINTS, 0, points.length / 4);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    },
  };
}
