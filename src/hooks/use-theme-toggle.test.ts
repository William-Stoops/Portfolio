import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useThemeToggle } from '@/hooks/use-theme-toggle';

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.removeProperty('--theme-reveal-x');
  document.documentElement.style.removeProperty('--theme-reveal-y');
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

  it('spreads the new theme from the pressed button through a view transition', async () => {
    const startViewTransition = vi.spyOn(document, 'startViewTransition');
    const button = document.createElement('button');
    button.style.cssText = 'position: fixed; left: 100px; top: 40px; width: 44px; height: 44px';
    document.body.append(button);
    const { result, act } = await renderHook(() => useThemeToggle());

    await act(() => {
      result.current.selectThemePreference('dark', button);
    });

    expect(startViewTransition).toHaveBeenCalledOnce();
    await expect.poll(() => document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--theme-reveal-x')).toBe('122px');
    expect(document.documentElement.style.getPropertyValue('--theme-reveal-y')).toBe('62px');
    button.remove();
  });

  it('switches at once when the visitor prefers reduced motion', async () => {
    // A query that always matches stands in for `prefers-reduced-motion: reduce`.
    vi.spyOn(window, 'matchMedia').mockReturnValue(window.matchMedia('(min-width: 0px)'));
    const startViewTransition = vi.spyOn(document, 'startViewTransition');
    const { result, act } = await renderHook(() => useThemeToggle());

    await act(() => {
      result.current.selectThemePreference('dark', document.body);
    });

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('lets a second choice interrupt the first transition without an error', async () => {
    const button = document.createElement('button');
    document.body.append(button);
    const { result, act } = await renderHook(() => useThemeToggle());

    await act(() => {
      result.current.selectThemePreference('dark', button);
      result.current.selectThemePreference('light', button);
    });

    // The skipped transition rejects its `ready` promise: it must be handled, or Vitest
    // reports an unhandled rejection.
    await expect.poll(() => document.documentElement.getAttribute('data-theme')).toBe('light');
    await new Promise((resolve) => setTimeout(resolve, 300));
    button.remove();
  });
});
