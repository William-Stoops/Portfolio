import {
  buildSurfaceGrid,
  buildWireframeIndices,
  invertMatrix,
  lookAt,
  multiplyMatrices,
  perspective,
  unprojectToGround,
} from '@/features/hero/utils/surface-math';

// An implied volatility surface, as William computes them: strikes across, maturities in
// depth, the volatility "smile" rising on both wings. Drawn in wireframe with raw WebGL2:
// a few kB where three.js would cost ~150 kB. Loaded on its own, after the page is up.

const COLUMNS = 72;
const ROWS = 40;
// World size of the surface: strikes (x) wider than maturities (z).
const HALF_WIDTH = 3.2;
const HALF_DEPTH = 2.2;

// The height lives on the GPU: the CPU uploads the grid once, then a few uniforms per frame.
const VERTEX_SHADER = `#version 300 es
in vec2 a_grid;
uniform mat4 u_viewProjection;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_pointerStrength;
uniform float u_calm;
uniform float u_pointSize;
out float v_height;
out float v_distance;

float surfaceHeight(vec2 p) {
  float smile = 0.95 * p.x * p.x;
  float termStructure = -0.28 * (p.y + 1.0);
  float swell = 0.22 * sin(2.4 * p.x + u_time * 0.55) * cos(1.9 * p.y - u_time * 0.4);
  float ripple = 0.06 * sin(7.0 * length(p - vec2(0.3, -0.2)) - u_time * 1.3);
  return (smile + termStructure + swell + ripple) * (1.0 - 0.65 * u_calm);
}

void main() {
  vec2 world = a_grid * vec2(${String(HALF_WIDTH)}, ${String(HALF_DEPTH)});
  float pointerDistance = distance(world, u_pointer);
  float height = surfaceHeight(a_grid) + u_pointerStrength * 0.85 * exp(-pointerDistance * pointerDistance * 1.6);
  v_height = height;
  vec4 position = u_viewProjection * vec4(world.x, height, world.y, 1.0);
  v_distance = position.w;
  gl_Position = position;
  // Only used by the points pass: the higher the vertex, the larger its light.
  gl_PointSize = u_pointSize * mix(0.6, 2.2, smoothstep(0.1, 1.0, height));
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
uniform vec3 u_low;
uniform vec3 u_high;
uniform bool u_isPoint;
in float v_height;
in float v_distance;
out vec4 color;

void main() {
  float heat = smoothstep(0.0, 1.0, v_height);
  float fog = smoothstep(10.0, 3.5, v_distance);
  float alpha = mix(0.5, 1.0, heat) * fog;
  if (u_isPoint) {
    // Round, soft-edged points, lit only where the surface rises.
    float edge = 1.0 - smoothstep(0.2, 0.5, length(gl_PointCoord - 0.5));
    alpha = edge * heat * fog;
  }
  color = vec4(mix(u_low, u_high, heat) * alpha, alpha);
}`;

type RgbChannels = readonly [number, number, number];

type SurfaceFrame = {
  // Seconds since the scene started.
  time: number;
  // Where the pointer touches the ground, in world units, and how strongly it pushes.
  pointer: readonly [number, number];
  pointerStrength: number;
  // From 0 (hero in view) to 1 (hero scrolled away): the surface settles down.
  calm: number;
  // From -1 to 1: horizontal pointer position, for a slight camera parallax.
  parallax: number;
};

export type SurfaceRenderer = {
  // Size in device pixels, and device pixels per CSS pixel.
  resize: (width: number, height: number, pixelRatio: number) => void;
  setColors: (low: RgbChannels, high: RgbChannels) => void;
  draw: (frame: SurfaceFrame) => void;
  // The ground point under a screen position (-1 to 1), with the camera of the last frame.
  groundUnder: (screenX: number, screenY: number) => readonly [number, number] | null;
  dispose: () => void;
};

// A slow sway, a touch of pointer parallax, and the camera rising as the hero scrolls
// away. Looking left of the surface centre puts the surface on the right, behind the
// portrait, away from the text.
function cameraFor(aspect: number, time: number, calm: number, parallax: number): Float32Array {
  const eyeX = 0.5 * Math.sin(time * 0.12) + 0.35 * parallax;
  return multiplyMatrices(
    perspective(0.8, aspect, 0.1, 30),
    lookAt([eyeX, 1.25 + 0.8 * calm, 4.3], [-1.6, 0.45, -0.5], [0, 1, 0]),
  );
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (shader === null) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== true) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (vertexShader === null || fragmentShader === null) {
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// Null when the browser has no WebGL2 or the shaders do not build: the caller keeps the
// static hero, which is complete on its own.
export function createSurfaceRenderer(canvas: HTMLCanvasElement): SurfaceRenderer | null {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
  if (gl === null) {
    return null;
  }
  const program = createProgram(gl);
  if (program === null) {
    return null;
  }

  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  const gridBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buildSurfaceGrid(COLUMNS, ROWS), gl.STATIC_DRAW);
  const gridLocation = gl.getAttribLocation(program, 'a_grid');
  gl.enableVertexAttribArray(gridLocation);
  gl.vertexAttribPointer(gridLocation, 2, gl.FLOAT, false, 0, 0);
  const indices = buildWireframeIndices(COLUMNS, ROWS);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const uniform = (name: string): WebGLUniformLocation | null =>
    gl.getUniformLocation(program, name);
  const locations = {
    viewProjection: uniform('u_viewProjection'),
    time: uniform('u_time'),
    pointer: uniform('u_pointer'),
    pointerStrength: uniform('u_pointerStrength'),
    calm: uniform('u_calm'),
    low: uniform('u_low'),
    high: uniform('u_high'),
    pointSize: uniform('u_pointSize'),
    isPoint: uniform('u_isPoint'),
  };
  const pointCount = COLUMNS * ROWS;

  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let inverseViewProjection = invertMatrix(cameraFor(1, 0, 0, 0));
  let pixelRatio = 1;

  return {
    resize(width, height, ratio) {
      pixelRatio = ratio;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    },
    setColors(low, high) {
      gl.uniform3f(locations.low, ...low);
      gl.uniform3f(locations.high, ...high);
    },
    draw({ time, pointer, pointerStrength, calm, parallax }) {
      const aspect = canvas.width / Math.max(canvas.height, 1);
      const viewProjection = cameraFor(aspect, time, calm, parallax);
      inverseViewProjection = invertMatrix(viewProjection);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(locations.viewProjection, false, viewProjection);
      gl.uniform1f(locations.time, time);
      gl.uniform2f(locations.pointer, ...pointer);
      gl.uniform1f(locations.pointerStrength, pointerStrength);
      gl.uniform1f(locations.calm, calm);
      gl.uniform1i(locations.isPoint, 0);
      gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
      // A second pass lights the vertices, in device pixels.
      gl.uniform1i(locations.isPoint, 1);
      gl.uniform1f(locations.pointSize, 2.5 * pixelRatio);
      gl.drawArrays(gl.POINTS, 0, pointCount);
    },
    groundUnder(screenX, screenY) {
      return unprojectToGround(inverseViewProjection, screenX, screenY);
    },
    dispose() {
      gl.deleteBuffer(gridBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    },
  };
}
