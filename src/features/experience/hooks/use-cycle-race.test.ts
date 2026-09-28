import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderHook } from 'vitest-browser-react';

import { useCycleRace } from '@/features/experience/hooks/use-cycle-race';
import { setSoundOn } from '@/lib/sound-preference';
import { emulateMediaQuery } from '@/testing/emulate-media-query';

const TIMES = { beforeMinutes: 600, afterMinutes: 5 } as const;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// The race runs on the clock: tests move it on by hand.
function useRaceClock(): void {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });
}

describe('useCycleRace', () => {
  it('waits on the start line until the visitor starts it', async () => {
    const { result } = await renderHook(() => useCycleRace(TIMES));

    expect(result.current.phase).toBe('ready');
    expect(result.current.frame.afterCycles).toBe(0);
    expect(result.current.laps).toBe(120);
  });

  it('races both cycles to scale, then stops on the result', async () => {
    emulateMediaQuery(REDUCED_MOTION, false);
    useRaceClock();
    const { result, act } = await renderHook(() => useCycleRace(TIMES));

    await act(() => {
      result.current.start();
    });
    await act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.phase).toBe('running');
    expect(result.current.frame.clock).toEqual({ hours: 5, minutes: 0 });
    expect(result.current.frame.afterCycles).toBe(60);

    await act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.phase).toBe('finished');
    expect(result.current.frame.afterCycles).toBe(120);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('starts over from the line when run again', async () => {
    emulateMediaQuery(REDUCED_MOTION, false);
    useRaceClock();
    const { result, act } = await renderHook(() => useCycleRace(TIMES));
    await act(() => {
      result.current.start();
    });
    await act(() => {
      vi.advanceTimersByTime(12_000);
    });

    await act(() => {
      result.current.start();
    });

    expect(result.current.phase).toBe('running');
    expect(result.current.frame.afterCycles).toBe(0);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('gives the result at once when the visitor asks for reduced motion', async () => {
    emulateMediaQuery(REDUCED_MOTION, true);
    const { result, act } = await renderHook(() => useCycleRace(TIMES));

    await act(() => {
      result.current.start();
    });

    expect(result.current.phase).toBe('finished');
    expect(result.current.frame.afterCycles).toBe(120);
  });

  it('stops its clock when the race leaves the page', async () => {
    emulateMediaQuery(REDUCED_MOTION, false);
    useRaceClock();
    const { result, act, unmount } = await renderHook(() => useCycleRace(TIMES));
    await act(() => {
      result.current.start();
    });

    await unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('taps at the start and rings the cabin chime at the finish, sounds on', async () => {
    // A gesture of the visitor's first: before one, a browser plays nothing.
    await userEvent.click(page.elementLocator(document.body));
    const started = vi.spyOn(OscillatorNode.prototype, 'start');
    const pitches = () =>
      started.mock.contexts.map((oscillator) =>
        oscillator instanceof OscillatorNode ? oscillator.frequency.value : Number.NaN,
      );
    setSoundOn(true);
    emulateMediaQuery(REDUCED_MOTION, false);
    useRaceClock();
    const { result, act } = await renderHook(() => useCycleRace(TIMES));

    await act(() => {
      result.current.start();
    });
    await expect.poll(pitches).toEqual([1568]);
    await act(() => {
      vi.advanceTimersByTime(12_000);
    });

    await expect.poll(pitches).toEqual([1568, 659.25, 523.25]);
    setSoundOn(false);
  });
});
