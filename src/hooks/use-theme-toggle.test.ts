import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useThemeToggle } from '@/hooks/use-theme-toggle';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

describe('useThemeToggle', () => {
  it('announces nothing before the visitor makes a choice', async () => {
    const { result } = await renderHook(() => useThemeToggle());

    expect(result.current.announcement).toBe('');
  });

  it('selects a preference and announces it', async () => {
    const { result, act } = await renderHook(() => useThemeToggle());

    await act(() => {
      result.current.selectThemePreference('dark');
    });

    expect(result.current.themePreference).toBe('dark');
    expect(result.current.announcement).toBe('Thème sombre activé');
  });

  it('announces the return to the system theme', async () => {
    const { result, act } = await renderHook(() => useThemeToggle());

    await act(() => {
      result.current.selectThemePreference('light');
    });
    await act(() => {
      result.current.selectThemePreference('system');
    });

    expect(result.current.announcement).toBe('Thème du système activé');
  });
});
