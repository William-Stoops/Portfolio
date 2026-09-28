import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { closeCommandPalette, useCommandPalette } from '@/hooks/use-command-palette';
import { useCommandPaletteShortcut } from '@/hooks/use-command-palette-shortcut';

afterEach(() => {
  closeCommandPalette();
});

function press(init: KeyboardEventInit): boolean {
  return window.dispatchEvent(new KeyboardEvent('keydown', { cancelable: true, ...init }));
}

async function renderShortcut() {
  return renderHook(() => {
    useCommandPaletteShortcut();
    return useCommandPalette();
  });
}

describe('useCommandPaletteShortcut', () => {
  it('opens the quick search with ⌘K on a Mac, and closes it the same way', async () => {
    const { result, act } = await renderShortcut();

    let isDefaultAllowed = true;
    await act(() => {
      isDefaultAllowed = press({ key: 'k', metaKey: true });
    });
    expect(result.current).toBe(true);
    expect(isDefaultAllowed).toBe(false);

    await act(() => {
      press({ key: 'k', metaKey: true });
    });
    expect(result.current).toBe(false);
  });

  it('answers Ctrl+K elsewhere', async () => {
    const { result, act } = await renderShortcut();

    await act(() => {
      press({ key: 'K', ctrlKey: true });
    });

    expect(result.current).toBe(true);
  });

  it('leaves every other key alone, the browser’s own shortcuts included', async () => {
    const { result, act } = await renderShortcut();

    let allowed: boolean[] = [];
    await act(() => {
      allowed = [
        press({ key: 'k' }),
        press({ key: 'k', ctrlKey: true, shiftKey: true }),
        press({ key: 'k', ctrlKey: true, altKey: true }),
        press({ key: 'j', ctrlKey: true }),
      ];
    });

    expect(result.current).toBe(false);
    expect(allowed).toEqual([true, true, true, true]);
  });
});
