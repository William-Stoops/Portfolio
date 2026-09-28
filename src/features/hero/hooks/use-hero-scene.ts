import { type RefObject, useEffect, useRef, useState } from 'react';
import * as z from 'zod/mini';

import { canRunHeroScene } from '@/features/hero/utils/scene-support';
import { whenIdle } from '@/lib/when-idle';

// The Network Information API is Chromium-only and untyped: parsed, not trusted.
const dataSaverSchema = z.object({ connection: z.object({ saveData: z.boolean() }) });

function isDataSaved(): boolean {
  const result = dataSaverSchema.safeParse(navigator);
  return result.success && result.data.connection.saveData;
}

// hero: starts on idle, reacts to the scroll. finale: waits for the page to near it (it
// sits at the bottom of the page: nothing is loaded for it at startup), and stays settled.
export type SceneVariant = 'hero' | 'finale';

// How far ahead of the viewport the finale starts loading, so it is drawn when it appears.
const FINALE_MARGIN = '400px';

function whenNear(element: Element, callback: () => void): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting === true) {
        observer.disconnect();
        callback();
      }
    },
    { rootMargin: FINALE_MARGIN },
  );
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
}

// Decides whether the WebGL surface runs, and starts it where it can. The scene itself
// (renderer and loop) is loaded on demand.
export function useHeroScene(variant: SceneVariant): {
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
      const stopScene = isDisposed
        ? null
        : startHeroScene(sceneCanvas, { isSettled: variant === 'finale' });
      if (stopScene === null) {
        return;
      }
      teardown = stopScene;
      setIsReady(true);
    }

    function start(): void {
      if (canvas !== null) {
        void startScene(canvas);
      }
    }
    const cancelStart = variant === 'hero' ? whenIdle(start) : whenNear(canvas, start);

    return () => {
      isDisposed = true;
      cancelStart();
      teardown();
    };
  }, [variant]);

  return { canvasRef, isReady };
}
