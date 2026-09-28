import { type RefObject, useEffect, useRef, useState } from 'react';

import { canRunFlowField } from '@/features/hero/utils/flow-field-support';
import { isDataSaved } from '@/lib/save-data';
import { whenIdle } from '@/lib/when-idle';

// Decides whether the hero's field moves, and starts it once the page is idle: its code (a
// shader and its loop) is a separate chunk, fetched only then, so it never competes with
// the first paint or hydration. Until then, and for good without WebGL2, the still
// gradient of the same tokens is the field.
export function useFlowField(): {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isLive: boolean;
} {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      canvas === null ||
      !canRunFlowField((query) => window.matchMedia(query).matches, isDataSaved())
    ) {
      return undefined;
    }

    let isDisposed = false;
    let teardown = (): void => undefined;

    async function startField(fieldCanvas: HTMLCanvasElement): Promise<void> {
      const { startFlowField } = await import('@/features/hero/utils/flow-field-runtime');
      const stopField = isDisposed ? null : startFlowField(fieldCanvas);
      if (stopField === null) {
        return;
      }
      teardown = stopField;
      setIsLive(true);
    }

    const cancelStart = whenIdle(() => {
      void startField(canvas);
    });

    return () => {
      isDisposed = true;
      cancelStart();
      teardown();
    };
  }, []);

  return { canvasRef, isLive };
}
