import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { useFlowField } from '@/features/hero/hooks/use-flow-field';
import { emulateMediaQuery } from '@/testing/emulate-media-query';

const MOTION_WELCOME = '(prefers-reduced-motion: no-preference)';

// Whether the browser draws on a graphics processor: decided by each test, since the test
// browser's own answer depends on the machine it runs on.
const graphics = vi.hoisted(() => ({ hasProcessor: true }));
vi.mock('@/lib/graphics-processor', () => ({
  hasGraphicsProcessor: () => graphics.hasProcessor,
}));

// The hook needs a canvas to start on: the smallest component that gives it one.
function Field() {
  const { canvasRef, isLive } = useFlowField();
  return <canvas ref={canvasRef} data-live={String(isLive)} width={64} height={64} />;
}

function liveState(container: HTMLElement): string | null | undefined {
  return container.querySelector('canvas')?.getAttribute('data-live');
}

afterEach(() => {
  vi.restoreAllMocks();
  graphics.hasProcessor = true;
});

describe('useFlowField', () => {
  it('starts the field once the page is idle, where motion is welcome', async () => {
    emulateMediaQuery(MOTION_WELCOME, true);
    const screen = await render(<Field />);

    // An idle callback may wait up to 2 s on a busy page (whenIdle), then the chunk loads.
    await expect.poll(() => liveState(screen.container), { timeout: 5000 }).toBe('true');
  });

  it('leaves the still gradient where motion is unwelcome, without even planning the field', async () => {
    emulateMediaQuery(MOTION_WELCOME, false);
    const idle = vi.spyOn(window, 'requestIdleCallback');
    const screen = await render(<Field />);

    expect(idle).not.toHaveBeenCalled();
    expect(liveState(screen.container)).toBe('false');
  });

  it('leaves the still gradient where no graphics processor would draw it', async () => {
    emulateMediaQuery(MOTION_WELCOME, true);
    graphics.hasProcessor = false;
    const idle = vi.spyOn(window, 'requestIdleCallback');
    const screen = await render(<Field />);

    await expect.poll(() => idle.mock.calls.length).toBe(1);
    // Past the idle callback: the chunk would have loaded and started by then.
    await new Promise((resolve) => setTimeout(resolve, 2500));
    expect(liveState(screen.container)).toBe('false');
  });

  it('gives up the planned start when the hero goes first', async () => {
    emulateMediaQuery(MOTION_WELCOME, true);
    const cancel = vi.spyOn(window, 'cancelIdleCallback');
    const screen = await render(<Field />);

    await screen.unmount();
    expect(cancel).toHaveBeenCalled();
  });
});
