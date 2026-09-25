import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useThemePreference } from '@/hooks/use-theme-preference';

// Literal on purpose: the key is a contract with the inline script in index.html.
const THEME_STORAGE_KEY = 'theme-preference';

const ROOT = document.documentElement;

afterEach(() => {
  ROOT.removeAttribute('data-theme');
  localStorage.clear();
});

describe('useThemePreference', () => {
  it('follows the system when no preference was applied', async () => {
    const { result } = await renderHook(() => useThemePreference());

    expect(result.current.themePreference).toBe('system');
  });

  it('reads the preference applied before first paint by the inline script', async () => {
    ROOT.setAttribute('data-theme', 'dark');

    const { result } = await renderHook(() => useThemePreference());

    expect(result.current.themePreference).toBe('dark');
  });

  it('treats an unknown data-theme value as the system preference', async () => {
    ROOT.setAttribute('data-theme', 'sepia');

    const { result } = await renderHook(() => useThemePreference());

    expect(result.current.themePreference).toBe('system');
  });

  it('applies and persists an explicit preference', async () => {
    const { result, act } = await renderHook(() => useThemePreference());

    await act(() => {
      result.current.setThemePreference('dark');
    });

    expect(result.current.themePreference).toBe('dark');
    expect(ROOT.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('clears the attribute and the stored value when going back to the system', async () => {
    ROOT.setAttribute('data-theme', 'light');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const { result, act } = await renderHook(() => useThemePreference());

    await act(() => {
      result.current.setThemePreference('system');
    });

    expect(result.current.themePreference).toBe('system');
    expect(ROOT.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('still applies the preference for the session when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage disabled', 'SecurityError');
    });
    const { result, act } = await renderHook(() => useThemePreference());

    await act(() => {
      result.current.setThemePreference('light');
    });

    expect(result.current.themePreference).toBe('light');
    expect(ROOT.getAttribute('data-theme')).toBe('light');
  });

  it('follows a preference changed in another tab', async () => {
    const { result, act } = await renderHook(() => useThemePreference());

    await act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: 'dark' }),
      );
    });

    expect(result.current.themePreference).toBe('dark');
    expect(ROOT.getAttribute('data-theme')).toBe('dark');
  });

  it('does not swallow unexpected storage errors', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new TypeError('Unexpected failure');
    });
    const { result } = await renderHook(() => useThemePreference());

    expect(() => {
      result.current.setThemePreference('dark');
    }).toThrow(TypeError);
  });

  it('ignores storage events about other keys', async () => {
    const { result, act } = await renderHook(() => useThemePreference());

    await act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other-key', newValue: 'dark' }));
    });

    expect(result.current.themePreference).toBe('system');
    expect(ROOT.hasAttribute('data-theme')).toBe(false);
  });
});
