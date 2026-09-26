import { afterEach, describe, expect, it, vi } from 'vitest';

import { whenIdle } from '@/lib/when-idle';

const idleCallbackDescriptor = Object.getOwnPropertyDescriptor(window, 'requestIdleCallback');

afterEach(() => {
  if (idleCallbackDescriptor !== undefined) {
    Object.defineProperty(window, 'requestIdleCallback', idleCallbackDescriptor);
  }
});

// Safari has no requestIdleCallback: remove it to take the fallback path.
function withoutIdleCallback(): void {
  Reflect.deleteProperty(window, 'requestIdleCallback');
}

describe('whenIdle', () => {
  it.each([
    ['with requestIdleCallback', () => undefined],
    ['without it, as in Safari', withoutIdleCallback],
  ])('runs the callback once the page is idle, %s', async (_, prepare) => {
    prepare();
    const callback = vi.fn<() => void>();

    whenIdle(callback);

    // A busy page may have no idle period at all: whenIdle then runs the callback at its
    // 2 s deadline. The poll must outlast it (its default is 1 s).
    await expect.poll(() => callback.mock.calls.length, { timeout: 3000 }).toBe(1);
  });

  it.each([
    ['with requestIdleCallback', () => undefined],
    ['without it, as in Safari', withoutIdleCallback],
  ])('never runs a cancelled callback, %s', async (_, prepare) => {
    prepare();
    const callback = vi.fn<() => void>();

    whenIdle(callback)();
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(callback).not.toHaveBeenCalled();
  });
});
