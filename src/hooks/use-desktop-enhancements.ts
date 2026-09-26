import { useEffect } from 'react';

import { whenIdle } from '@/lib/when-idle';

// Only where a pointer hovers precisely and motion is welcome: touch screens have no cursor
// to follow, and the decoding text is motion.
const ENHANCEMENTS_QUERY =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

// Loads the desktop touches (cursor ring, decoding texts) on idle, in their own chunk.
export function useDesktopEnhancements(): void {
  useEffect(() => {
    if (!window.matchMedia(ENHANCEMENTS_QUERY).matches) {
      return undefined;
    }
    let isDisposed = false;
    let stop = (): void => undefined;

    async function start(): Promise<void> {
      const { startDesktopEnhancements } = await import('@/lib/desktop-enhancements');
      if (!isDisposed) {
        stop = startDesktopEnhancements();
      }
    }

    const cancelIdle = whenIdle(() => {
      void start();
    });
    return () => {
      isDisposed = true;
      cancelIdle();
      stop();
    };
  }, []);
}
