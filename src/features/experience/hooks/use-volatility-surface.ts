import { type RefObject, useEffect, useRef, useState } from 'react';

import { type SurfaceAxes, type SurfaceReading } from '@/features/experience/types/volatility-lab';
import { whenNear } from '@/lib/when-near';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// The surface is solved and rises once a fifth of the screen above the bottom edge: the
// visitor sees it happen.
const START_MARGIN = '0px 0px -20% 0px';

// Starts the lab's surface when the visitor reaches it: the solver and the drawing are a
// separate chunk, fetched only then. Gives back the point read under the pointer, for the
// words over the figure.
export function useVolatilitySurface(axes: SurfaceAxes): {
  controlsRef: RefObject<HTMLFieldSetElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  reading: SurfaceReading | null;
} {
  const controlsRef = useRef<HTMLFieldSetElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reading, setReading] = useState<SurfaceReading | null>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    const canvas = canvasRef.current;
    if (controls === null || canvas === null) {
      return undefined;
    }
    let isDisposed = false;
    let teardown = (): void => undefined;

    async function startSurface(
      labControls: HTMLElement,
      labCanvas: HTMLCanvasElement,
    ): Promise<void> {
      const { startVolatilitySurface } =
        await import('@/features/experience/utils/volatility-surface-runtime');
      const stopSurface = isDisposed
        ? null
        : startVolatilitySurface(labCanvas, {
            axes,
            controls: labControls,
            isStill: window.matchMedia(REDUCED_MOTION).matches,
            onReadout: setReading,
          });
      if (stopSurface !== null) {
        teardown = stopSurface;
      }
    }

    const cancelStart = whenNear(
      canvas,
      () => {
        void startSurface(controls, canvas);
      },
      START_MARGIN,
    );
    return () => {
      isDisposed = true;
      cancelStart();
      teardown();
    };
  }, [axes]);

  return { controlsRef, canvasRef, reading };
}
