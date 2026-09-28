import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderHook } from 'vitest-browser-react';

import {
  closeCommandPalette,
  openCommandPalette,
  toggleCommandPalette,
  useCommandPalette,
} from '@/hooks/use-command-palette';
import { setSoundOn } from '@/lib/sound-preference';

afterEach(() => {
  closeCommandPalette();
  document.body.replaceChildren();
});

describe('useCommandPalette', () => {
  it('opens and closes the palette, wherever it is asked from', async () => {
    const { result, act } = await renderHook(() => useCommandPalette());
    expect(result.current).toBe(false);

    await act(() => {
      openCommandPalette();
    });
    expect(result.current).toBe(true);

    await act(() => {
      toggleCommandPalette();
    });
    expect(result.current).toBe(false);
  });

  it('gives the focus back to what had it when the palette closes', async () => {
    const button = document.createElement('button');
    const field = document.createElement('input');
    document.body.append(button, field);
    button.focus();
    const { act } = await renderHook(() => useCommandPalette());

    await act(() => {
      openCommandPalette();
    });
    field.focus();
    await act(() => {
      closeCommandPalette();
    });

    expect(document.activeElement).toBe(button);
  });

  it('gives the focus back to the button that opened it, even where a click does not focus it', async () => {
    const button = document.createElement('button');
    document.body.append(button);
    const { act } = await renderHook(() => useCommandPalette());

    await act(() => {
      openCommandPalette(button);
    });
    await act(() => {
      closeCommandPalette();
    });

    expect(document.activeElement).toBe(button);
  });

  it('opens on two quick notes, once the visitor turned the sounds on', async () => {
    // A gesture of the visitor's first: before one, a browser plays nothing.
    await userEvent.click(page.elementLocator(document.body));
    const started = vi.spyOn(OscillatorNode.prototype, 'start');
    setSoundOn(true);
    const { act } = await renderHook(() => useCommandPalette());

    await act(() => {
      openCommandPalette();
    });

    await expect.poll(() => started.mock.calls.length).toBe(2);
    setSoundOn(false);
    vi.restoreAllMocks();
  });
});
