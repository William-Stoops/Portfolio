import { afterEach, describe, expect, it, vi } from 'vitest';

import { hasGraphicsProcessor } from '@/lib/graphics-processor';

afterEach(() => {
  vi.restoreAllMocks();
});

const SWIFTSHADER =
  'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)';
const APPLE_GPU = 'ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)';

// A real WebGL2 context of the test browser, whose renderer answers with the given names:
// the test browser's own renderer depends on the machine it runs on.
function grantContextNamed(names: { masked: string | null; unmasked: string; isHidden?: boolean }) {
  const granted = document.createElement('canvas').getContext('webgl2');
  if (granted === null) {
    throw new Error('This browser has no WebGL2');
  }
  const debugInfo = granted.getExtension('WEBGL_debug_renderer_info');
  const loseContext = granted.getExtension('WEBGL_lose_context');
  if (debugInfo === null || loseContext === null) {
    throw new Error('This browser cannot name its renderer, nor give a context back');
  }
  vi.spyOn(granted, 'getParameter').mockImplementation((name) =>
    name === debugInfo.UNMASKED_RENDERER_WEBGL ? names.unmasked : names.masked,
  );
  if (names.isHidden === true) {
    // A browser that offers no debug extension: the context can still be given back.
    Object.defineProperty(granted, 'getExtension', {
      value: (name: string) => (name === 'WEBGL_lose_context' ? loseContext : null),
      configurable: true,
      writable: true,
    });
  }
  const askExtension = vi.spyOn(granted, 'getExtension');
  const giveBack = vi.spyOn(loseContext, 'loseContext');
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(granted);
  return { askExtension, giveBack };
}

describe('hasGraphicsProcessor', () => {
  it('asks for WebGL2 without a major performance caveat, and takes a refusal as a no', () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(hasGraphicsProcessor()).toBe(false);
    expect(getContext).toHaveBeenCalledWith('webgl2', { failIfMajorPerformanceCaveat: true });
  });

  it('answers yes on a graphics processor, and lets the context go at once', () => {
    const { giveBack } = grantContextNamed({ masked: 'WebKit WebGL', unmasked: APPLE_GPU });

    expect(hasGraphicsProcessor()).toBe(true);
    expect(giveBack).toHaveBeenCalledOnce();
  });

  it('answers no on a software renderer that headless Chromium grants without a caveat', () => {
    const { giveBack } = grantContextNamed({ masked: 'WebKit WebGL', unmasked: SWIFTSHADER });

    expect(hasGraphicsProcessor()).toBe(false);
    expect(giveBack).toHaveBeenCalledOnce();
  });

  it('reads the name a browser gives unmasked, without asking for the debug extension', () => {
    const { askExtension } = grantContextNamed({ masked: 'llvmpipe', unmasked: APPLE_GPU });

    expect(hasGraphicsProcessor()).toBe(false);
    expect(askExtension).not.toHaveBeenCalledWith('WEBGL_debug_renderer_info');
  });

  it('trusts the granted context where the browser keeps the renderer masked', () => {
    grantContextNamed({ masked: 'WebKit WebGL', unmasked: SWIFTSHADER, isHidden: true });

    expect(hasGraphicsProcessor()).toBe(true);
  });

  it('trusts the granted context where the driver gives no name', () => {
    grantContextNamed({ masked: null, unmasked: APPLE_GPU });

    expect(hasGraphicsProcessor()).toBe(true);
  });
});
