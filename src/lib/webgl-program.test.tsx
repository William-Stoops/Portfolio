import { assert, describe, expect, it } from 'vitest';

import { createShaderProgram } from '@/lib/webgl-program';

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
out vec4 color;
void main() {
  color = vec4(1.0);
}`;

function context(): WebGL2RenderingContext {
  const gl = document.createElement('canvas').getContext('webgl2');
  assert(gl !== null, 'the test browser has WebGL2');
  return gl;
}

describe('createShaderProgram', () => {
  it('builds a program from its two shaders', () => {
    const gl = context();

    const program = createShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);

    assert(program !== null);
    expect(gl.getProgramParameter(program, gl.LINK_STATUS)).toBe(true);
  });

  it('gives nothing when a shader does not compile', () => {
    expect(createShaderProgram(context(), 'not glsl', FRAGMENT_SHADER)).toBeNull();
  });

  it('gives nothing when the shaders do not link', () => {
    // The fragment shader reads a varying the vertex shader never writes.
    const fragmentShader = `#version 300 es
precision mediump float;
in float v_missing;
out vec4 color;
void main() {
  color = vec4(v_missing);
}`;

    expect(createShaderProgram(context(), VERTEX_SHADER, fragmentShader)).toBeNull();
  });
});
