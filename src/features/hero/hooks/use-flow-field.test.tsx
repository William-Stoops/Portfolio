import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { useFlowField } from '@/features/hero/hooks/use-flow-field';
import { emulateMediaQuery } from '@/testing/emulate-media-query';

const MOTION_WELCOME = '(prefers-reduced-motion: no-preference)';

// Whether the browser draws on a graphics processor: decided by each test, since the test
// browser's own answer depends on the machine it runs on. `onAsk` runs as the hook asks.
const graphics = vi.hoisted(() => ({
  hasProcessor: true,
  onAsk: (): void => undefined,
}));
vi.mock('@/lib/graphics-processor', () => ({
  hasGraphicsProcessor: () => {
    graphics.onAsk();
    return graphics.hasProcessor;
  },
}));

// The field's own runtime is tested apart (flow-field-runtime.test): here it answers as each
// test says, a way to stop it or none (no WebGL2).
const runtime = vi.hoisted(() => ({
  start: vi.fn<(canvas: HTMLCanvasElement) => (() => void) | null>(),
}));
vi.mock('@/features/hero/utils/flow-field-runtime', () => ({
  startFlowField: (canvas: HTMLCanvasElement) => runtime.start(canvas),
}));

// The hook needs a canvas to start on: the smallest component that gives it one.
function Field() {
  const { canvasRef, isLive } = useFlowField();
  return <canvas ref={canvasRef} data-live={String(isLive)} width={64} height={64} />;
}

function liveState(container: HTMLElement): string | null | undefined {
  return container.querySelector('canvas')?.getAttribute('data-live');
}

beforeEach(() => {
  runtime.start.mockReset();
  runtime.start.mockReturnValue(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  graphics.hasProcessor = true;
  graphics.onAsk = () => undefined;
});

describe('useFlowField', () => {
  it('starts the field once the page is idle, where motion is welcome, and stops it after', async () => {
    emulateMediaQuery(MOTION_WELCOME, true);
    const stop = vi.fn<() => void>();
    runtime.start.mockReturnValue(stop);
    const screen = await render(<Field />);

    // An idle callback may wait up to 2 s on a busy page (whenIdle), then the chunk loads.
    await expect.poll(() => liveState(screen.container), { timeout: 5000 }).toBe('true');
    expect(runtime.start).toHaveBeenCalledWith(screen.container.querySelector('canvas'));

    await screen.unmount();
    expect(stop).toHaveBeenCalledOnce();
  });

  it('leaves the still gradient where the runtime finds no WebGL2', async () => {
    emulateMediaQuery(MOTION_WELCOME, true);
    runtime.start.mockReturnValue(null);
    const screen = await render(<Field />);

    await expect.poll(() => runtime.start.mock.calls.length, { timeout: 5000 }).toBe(1);
    expect(liveState(screen.container)).toBe('false');
  });

  it('never starts a field for a hero gone while its code was loading', async () => {
    emulateMediaQuery(MOTION_WELCOME, true);
    let hasAsked = false;
    const screen = await render(<Field />);
    graphics.onAsk = () => {
      void screen.unmount();
      hasAsked = true;
    };

    await expect.poll(() => hasAsked, { timeout: 5000 }).toBe(true);
    // The chunk's import resolves after the unmount: the field must not start then.
    await import('@/features/hero/utils/flow-field-runtime');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(runtime.start).not.toHaveBeenCalled();
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
