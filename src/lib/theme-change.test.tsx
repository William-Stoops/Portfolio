import { afterEach, describe, expect, it, vi } from 'vitest';

import { onThemeChange } from '@/lib/theme-change';

afterEach(() => {
  delete document.documentElement.dataset['theme'];
});

describe('onThemeChange', () => {
  it('calls back when a theme is chosen, until it stops listening', async () => {
    const callback = vi.fn<() => void>();
    const stop = onThemeChange(callback);

    document.documentElement.dataset['theme'] = 'dark';
    await expect.poll(() => callback.mock.calls.length).toBe(1);

    stop();
    document.documentElement.dataset['theme'] = 'light';
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('ignores the other attributes of the page', async () => {
    const callback = vi.fn<() => void>();
    const stop = onThemeChange(callback);

    document.documentElement.lang = 'fr';
    await new Promise((resolve) => setTimeout(resolve, 50));
    stop();

    expect(callback).not.toHaveBeenCalled();
  });
});
