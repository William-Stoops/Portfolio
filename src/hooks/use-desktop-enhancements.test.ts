import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useDesktopEnhancements } from '@/hooks/use-desktop-enhancements';

describe('useDesktopEnhancements', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads nothing on a touch screen or with reduced motion', async () => {
    // A query that never matches stands in for a coarse pointer or reduced motion.
    vi.spyOn(window, 'matchMedia').mockReturnValue(window.matchMedia('(max-width: 0px)'));
    const { unmount } = await renderHook(() => {
      useDesktopEnhancements();
    });

    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(document.querySelector('[data-cursor-follower]')).toBeNull();
    await unmount();
  });

  it('loads the cursor on idle for a precise pointer, and removes it on unmount', async () => {
    const { unmount } = await renderHook(() => {
      useDesktopEnhancements();
    });

    await expect
      .poll(() => document.querySelector('[data-cursor-follower]'), { timeout: 5000 })
      .not.toBeNull();
    await unmount();

    expect(document.querySelector('[data-cursor-follower]')).toBeNull();
  });
});
