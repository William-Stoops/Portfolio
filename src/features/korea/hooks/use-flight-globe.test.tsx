import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { useFlightGlobe } from '@/features/korea/hooks/use-flight-globe';
import { emulateMediaQuery } from '@/testing/emulate-media-query';

const PINNED_SCENE_QUERY =
  '(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 40rem)';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// A large, tall screen where the scene is pinned (or not).
function emulatePinnedScene(isPinned: boolean) {
  return emulateMediaQuery(PINNED_SCENE_QUERY, isPinned);
}

function Scene() {
  const { trackRef, globeRef, isGlobe } = useFlightGlobe('east');

  return (
    <div ref={trackRef} data-testid="track" data-globe={isGlobe ? '' : undefined}>
      <div ref={globeRef} style={{ width: 200, height: 200 }}>
        <canvas />
        <span data-globe-place="origin" />
        <span data-globe-place="destination" />
        <div data-globe-plane />
      </div>
    </div>
  );
}

// A canvas that never received a WebGL context still gives a 2D one.
function hasWebGlContext(): boolean {
  return document.querySelector('canvas')?.getContext('2d') === null;
}

describe('useFlightGlobe', () => {
  it('shows the globe once its pinned scene nears', async () => {
    emulatePinnedScene(true);
    const screen = await render(<Scene />);

    await expect.element(screen.getByTestId('track')).toHaveAttribute('data-globe');
  });

  it('gives the flat arc back when the scene stops being pinned', async () => {
    const pinnedScene = emulatePinnedScene(true);
    const screen = await render(<Scene />);
    await expect.element(screen.getByTestId('track')).toHaveAttribute('data-globe');

    pinnedScene.change(false);

    await expect.element(screen.getByTestId('track')).not.toHaveAttribute('data-globe');
  });

  it('stays off where the scene is not pinned: small screens, reduced motion', async () => {
    emulatePinnedScene(false);
    const screen = await render(<Scene />);
    await new Promise((resolve) => setTimeout(resolve, 300));

    await expect.element(screen.getByTestId('track')).not.toHaveAttribute('data-globe');
    expect(hasWebGlContext()).toBe(false);
  });

  it('stays off when the visitor saves data', async () => {
    emulatePinnedScene(true);
    vi.stubGlobal('navigator', { connection: { saveData: true } });
    const screen = await render(<Scene />);
    await new Promise((resolve) => setTimeout(resolve, 300));

    await expect.element(screen.getByTestId('track')).not.toHaveAttribute('data-globe');
    expect(hasWebGlContext()).toBe(false);
  });
});
