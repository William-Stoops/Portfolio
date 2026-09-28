import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { playSound } from '@/lib/play-sound';
import { setSoundOn } from '@/lib/sound-preference';

afterEach(() => {
  setSoundOn(false);
  vi.restoreAllMocks();
});

// The tones the synthesiser starts, by their pitch.
function listenToTones() {
  return vi.spyOn(OscillatorNode.prototype, 'start');
}

function pitchesOf(started: ReturnType<typeof listenToTones>): number[] {
  return started.mock.contexts.map((oscillator) =>
    oscillator instanceof OscillatorNode ? oscillator.frequency.value : Number.NaN,
  );
}

// A gesture of the visitor's: before one, a browser plays nothing a page starts by itself.
async function touchThePage(): Promise<void> {
  await userEvent.click(page.elementLocator(document.body));
}

describe('playSound', () => {
  // First: no test before it has touched this page yet.
  it('plays nothing before the visitor’s first gesture, even with the sounds on', async () => {
    const started = listenToTones();
    setSoundOn(true);

    playSound('chime');

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    expect(started).not.toHaveBeenCalled();
  });

  it('stays silent while the sounds are off, as they are by default', async () => {
    await touchThePage();
    const started = listenToTones();

    playSound('chime');

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    expect(started).not.toHaveBeenCalled();
  });

  it('plays the cabin chime, a high tone then a low one, once the sounds are on', async () => {
    await touchThePage();
    const started = listenToTones();
    setSoundOn(true);

    playSound('chime');

    await expect.poll(() => pitchesOf(started)).toEqual([659.25, 523.25]);
  });

  it('keeps every sound short and quiet', async () => {
    await touchThePage();
    const stopped = vi.spyOn(OscillatorNode.prototype, 'stop');
    const peaks = vi.spyOn(AudioParam.prototype, 'exponentialRampToValueAtTime');
    setSoundOn(true);

    playSound('tap');
    playSound('open');

    await expect.poll(() => stopped.mock.calls.length).toBe(3);
    const [first] = stopped.mock.contexts;
    const now = first instanceof OscillatorNode ? first.context.currentTime : 0;
    const lengths = stopped.mock.calls.map(([when = 0]) => when - now);
    expect(Math.max(...lengths)).toBeLessThan(0.3);
    expect(Math.max(...peaks.mock.calls.map(([value]) => value))).toBeLessThanOrEqual(0.06);
  });
});
