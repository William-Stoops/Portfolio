import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import {
  closeCommandPalette,
  openCommandPalette,
  toggleCommandPalette,
  useCommandPalette,
} from '@/hooks/use-command-palette';

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
});
