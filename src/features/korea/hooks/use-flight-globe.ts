import { type RefObject, useEffect, useRef, useState } from 'react';

import { type FlightDirection } from '@/features/korea/types/flight-direction';
import { isDataSaved } from '@/lib/save-data';
import { whenNear } from '@/lib/when-near';

// Where the flight scene is pinned (motion.css, voyage-track): the globe turns with the
// scroll across the pinned stretch, so it needs it. The same query as the CSS.
const PINNED_SCENE_QUERY =
  '(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 40rem)';
// How far ahead of the viewport the globe starts loading, so it is drawn when it appears.
const LOAD_MARGIN = '800px';

// Decides whether the globe replaces the flat arc of a flight scene, and starts it when
// the scene nears. The globe itself (map, renderer, loop) is a separate chunk, fetched only
// then; without WebGL2, the arc stays.
export function useFlightGlobe(direction: FlightDirection): {
  trackRef: RefObject<HTMLDivElement | null>;
  globeRef: RefObject<HTMLDivElement | null>;
  isGlobe: boolean;
} {
  const trackRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const [isGlobe, setIsGlobe] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const globe = globeRef.current;
    const pinnedScene = window.matchMedia(PINNED_SCENE_QUERY);
    if (
      track === null ||
      globe === null ||
      !pinnedScene.matches ||
      !CSS.supports('animation-timeline: view()') ||
      isDataSaved()
    ) {
      return undefined;
    }

    let isDisposed = false;
    let isStarted = false;
    let teardown = (): void => undefined;

    // A window resized below the pinned size gives the arc back, and the globe returns
    // with the size.
    function showGlobe(): void {
      setIsGlobe(isStarted && pinnedScene.matches);
    }

    async function startGlobe(scene: { globe: HTMLElement; track: HTMLElement }): Promise<void> {
      const { startFlightGlobe } = await import('@/features/korea/utils/flight-globe-runtime');
      const stopGlobe = isDisposed ? null : startFlightGlobe(scene, direction);
      if (stopGlobe === null) {
        return;
      }
      teardown = stopGlobe;
      isStarted = true;
      showGlobe();
    }

    pinnedScene.addEventListener('change', showGlobe);
    const cancelStart = whenNear(
      track,
      () => {
        void startGlobe({ globe, track });
      },
      LOAD_MARGIN,
    );

    return () => {
      isDisposed = true;
      cancelStart();
      pinnedScene.removeEventListener('change', showGlobe);
      teardown();
    };
  }, [direction]);

  return { trackRef, globeRef, isGlobe };
}
