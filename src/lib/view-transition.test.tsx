import { afterEach, describe, expect, it, vi } from 'vitest';

import { runViewTransition, settleViewTransition } from '@/lib/view-transition';

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

describe('settleViewTransition', () => {
  it.each(['AbortError', 'InvalidStateError'])(
    'accepts a transition skipped with %s: the change still happens',
    async (name) => {
      const ready = Promise.reject(new DOMException('Skipped', name));

      await expect(settleViewTransition({ ready })).resolves.toBeUndefined();
    },
  );

  it('lets any other error through', async () => {
    const ready = Promise.reject(new TypeError('Broken'));

    await expect(settleViewTransition({ ready })).rejects.toThrow('Broken');
  });
});
