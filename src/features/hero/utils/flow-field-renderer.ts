import { createShaderProgram } from '@/lib/webgl-program';
import { type RgbChannels } from '@/utils/parse-rgb-color';

export type FlowTints = {
  sky: RgbChannels;
  blue: RgbChannels;
  violet: RgbChannels;
  peach: RgbChannels;
};

type FlowRenderer = {
  setTints: (tints: FlowTints) => void;
  resize: (width: number, height: number) => void;
  draw: (seconds: number) => void;
  dispose: () => void;
};

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Four tints blended by three slow noise fields (simplex noise, Ashima Arts, MIT licence):
// each field drifts at its own pace, so the colours flow without ever repeating.
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec3 sky;
uniform vec3 blue;
uniform vec3 violet;
uniform vec3 peach;
out vec4 fragment;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y
    + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec3 ns = 0.142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  // Stretched along the width: long soft bands rather than round spots.
  uv.x *= resolution.x / resolution.y * 0.55;
  float a = snoise(vec3(uv * vec2(1.1, 1.8), time * 0.045));
  float b = snoise(vec3(uv * vec2(1.7, 1.2) + 7.3, time * 0.06));
  float c = snoise(vec3(uv * 1.4 - 3.1, time * 0.035));
  vec3 colour = mix(sky, blue, smoothstep(-0.55, 0.55, a));
  colour = mix(colour, violet, smoothstep(0.0, 0.75, b) * 0.85);
  colour = mix(colour, peach, smoothstep(0.25, 0.85, c) * 0.9);
  fragment = vec4(colour, 1.0);
}`;

// The two triangles that cover the canvas.
const FULL_SCREEN = Float32Array.of(-1, -1, 1, -1, -1, 1, 1, 1);

// Draws the hero's living field (ADR 0037) in WebGL2. Null without WebGL2 or when the
// shaders fail: the still gradient under the canvas is then the field.
export function createFlowRenderer(canvas: HTMLCanvasElement): FlowRenderer | null {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
  });
  if (gl === null) {
    return null;
  }
  const program = createShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  if (program === null) {
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULL_SCREEN, gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniform = (name: string): WebGLUniformLocation | null =>
    gl.getUniformLocation(program, name);
  const resolution = uniform('resolution');
  const time = uniform('time');
  const tintUniforms = {
    sky: uniform('sky'),
    blue: uniform('blue'),
    violet: uniform('violet'),
    peach: uniform('peach'),
  };

  return {
    setTints: (tints) => {
      for (const name of ['sky', 'blue', 'violet', 'peach'] as const) {
        gl.uniform3fv(tintUniforms[name], tints[name]);
      }
    },
    resize: (width, height) => {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    },
    draw: (seconds) => {
      gl.uniform1f(time, seconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose: () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
