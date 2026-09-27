import { afterEach, describe, expect, it, vi } from 'vitest';

import { runViewTransition } from '@/lib/view-transition';

const typeSetDescriptor = Object.getOwnPropertyDescriptor(window, 'ViewTransitionTypeSet');

afterEach(() => {
  if (typeSetDescriptor !== undefined) {
    Object.defineProperty(window, 'ViewTransitionTypeSet', typeSetDescriptor);
  }
});

describe('runViewTransition', () => {
  it('runs the update inside a view transition carrying its type', async () => {
    const startViewTransition = vi.spyOn(document, 'startViewTransition');
    const update = vi.fn<() => Promise<void>>(() => Promise.resolve());

    runViewTransition('video-morph', update);

    expect(startViewTransition).toHaveBeenCalledWith(
      expect.objectContaining({ types: ['video-morph'] }),
    );
    await expect.poll(() => update.mock.calls.length).toBe(1);
  });

  it('simply runs the update when the visitor prefers reduced motion', () => {
    // A query that always matches stands in for `prefers-reduced-motion: reduce`.
    vi.spyOn(window, 'matchMedia').mockReturnValue(window.matchMedia('(min-width: 0px)'));
    const startViewTransition = vi.spyOn(document, 'startViewTransition');
    const update = vi.fn<() => Promise<void>>(() => Promise.resolve());

    runViewTransition('video-morph', update);

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });

  it('simply runs the update in a browser without typed view transitions', () => {
    Reflect.deleteProperty(window, 'ViewTransitionTypeSet');
    const startViewTransition = vi.spyOn(document, 'startViewTransition');
    const update = vi.fn<() => Promise<void>>(() => Promise.resolve());

    runViewTransition('video-morph', update);

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });
});

describe('a transition interrupted by the next one', () => {
  it('still applies both changes, without an unhandled rejection', async () => {
    const first = vi.fn<() => Promise<void>>(() => Promise.resolve());
    const second = vi.fn<() => Promise<void>>(() => Promise.resolve());

    runViewTransition('theme', first);
    runViewTransition('theme', second);

    // The skipped transition rejects its `ready` promise: it must be handled, or Vitest
    // reports an unhandled rejection.
    await expect.poll(() => second.mock.calls.length).toBe(1);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(first).toHaveBeenCalledOnce();
  });
});
