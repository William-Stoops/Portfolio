import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderHook } from 'vitest-browser-react';

import { useSoundOnArrival } from '@/hooks/use-sound-on-arrival';
import { setSoundOn } from '@/lib/sound-preference';

afterEach(() => {
  setSoundOn(false);
  vi.restoreAllMocks();
});

describe('useSoundOnArrival', () => {
  it('rings as the page arrives, once the visitor has touched the site with the sounds on', async () => {
    await userEvent.click(page.elementLocator(document.body));
    const started = vi.spyOn(OscillatorNode.prototype, 'start');
    setSoundOn(true);

    await renderHook(() => {
      useSoundOnArrival('chime');
    });

    await expect
      .poll(() =>
        started.mock.contexts.map((oscillator) =>
          oscillator instanceof OscillatorNode ? oscillator.frequency.value : Number.NaN,
        ),
      )
      .toEqual([659.25, 523.25]);
  });
});
