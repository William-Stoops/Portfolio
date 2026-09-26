import { type RefObject, useEffect, useRef, useState } from 'react';
import * as z from 'zod/mini';

import { canRunHeroScene } from '@/features/hero/utils/scene-support';

// The Network Information API is Chromium-only and untyped: parsed, not trusted.
const dataSaverSchema = z.object({ connection: z.object({ saveData: z.boolean() }) });

function isDataSaved(): boolean {
  const result = dataSaverSchema.safeParse(navigator);
  return result.success && result.data.connection.saveData;
}

// After the page is up and idle: the scene never competes with the first paint or with
// hydration, and its code (a separate chunk) is only fetched when it will run.
function whenIdle(callback: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => {
      window.cancelIdleCallback(handle);
    };
  }
  // Safari has no requestIdleCallback.
  const handle = setTimeout(callback, 300);
  return () => {
    clearTimeout(handle);
  };
}

// Decides whether the hero's WebGL surface runs, and starts it on idle where it can. The
// scene itself (renderer and loop) is loaded on demand.
export function useHeroScene(): {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isReady: boolean;
} {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      canvas === null ||
      !canRunHeroScene((query) => window.matchMedia(query).matches, isDataSaved())
    ) {
      return undefined;
    }

    let isDisposed = false;
    let teardown = (): void => undefined;

    // The scene's code is a separate chunk, fetched only here.
    async function startScene(sceneCanvas: HTMLCanvasElement): Promise<void> {
      const { startHeroScene } = await import('@/features/hero/utils/hero-scene-runtime');
      const stopScene = isDisposed ? null : startHeroScene(sceneCanvas);
      if (stopScene === null) {
        return;
      }
      teardown = stopScene;
      setIsReady(true);
    }

    const cancelIdle = whenIdle(() => {
      void startScene(canvas);
    });

    return () => {
      isDisposed = true;
      cancelIdle();
      teardown();
    };
  }, []);

  return { canvasRef, isReady };
}
