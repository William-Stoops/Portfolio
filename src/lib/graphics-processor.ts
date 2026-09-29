import * as z from 'zod/mini';

// Renderers that draw WebGL on the page's own processor: SwiftShader (Chromium without a
// graphics processor, headless or blocklisted), Mesa's llvmpipe and softpipe, the basic
// driver of Windows.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

// The name Chromium and Safari give in place of the renderer's own.
const MASKED_RENDERER = 'WebKit WebGL';

// A driver's answer, untyped by the DOM: parsed, not trusted.
const rendererNameSchema = z.string();

function rendererName(context: WebGL2RenderingContext): string {
  const masked = rendererNameSchema.safeParse(context.getParameter(context.RENDERER));
  if (!masked.success || masked.data !== MASKED_RENDERER) {
    return masked.success ? masked.data : '';
  }
  const debugInfo = context.getExtension('WEBGL_debug_renderer_info');
  const unmasked = rendererNameSchema.safeParse(
    debugInfo === null ? null : context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
  );
  return unmasked.success ? unmasked.data : masked.data;
}

// Whether the browser draws WebGL2 on a graphics processor. Without one (a software
// renderer: a headless browser, a blocklisted driver), a scene drawn every frame takes its
// time from the page's own processor: a scene that is only decoration stays still there.
// The performance caveat alone does not tell: headless Chromium grants SwiftShader without
// one, so the renderer's name is read too.
export function hasGraphicsProcessor(): boolean {
  const context = document
    .createElement('canvas')
    .getContext('webgl2', { failIfMajorPerformanceCaveat: true });
  if (context === null) {
    return false;
  }
  const isSoftware = SOFTWARE_RENDERER.test(rendererName(context));
  // A context is a scarce resource: the question asked, it is given back at once.
  context.getExtension('WEBGL_lose_context')?.loseContext();
  return !isSoftware;
}
