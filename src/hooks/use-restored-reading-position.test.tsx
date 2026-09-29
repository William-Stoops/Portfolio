import { type ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useRestoredReadingPosition } from '@/hooks/use-restored-reading-position';

afterEach(() => {
  sessionStorage.clear();
  document.getElementById('main')?.remove();
  window.scrollTo(0, 0);
});

function onPage(path: string) {
  return function Page({ children }: { children: ReactNode }) {
    const router = createMemoryRouter([{ path: '*', element: children }], {
      initialEntries: [path],
    });
    return <RouterProvider router={router} />;
  };
}

describe('useRestoredReadingPosition', () => {
  it('opens the page where the reader was in the other language', async () => {
    const main = document.createElement('main');
    main.id = 'main';
    const block = document.createElement('p');
    block.style.cssText = 'height: 3000px; margin: 0';
    main.append(block);
    document.body.append(main);
    sessionStorage.setItem(
      'locale-switch-position',
      JSON.stringify({ destination: '/en', block: 0, top: -500 }),
    );

    await renderHook(
      () => {
        useRestoredReadingPosition();
      },
      { wrapper: onPage('/en') },
    );

    expect(block.getBoundingClientRect().top).toBeCloseTo(-500, 0);
  });

  it('realigns the block once late fonts have changed the heights above it', async () => {
    let fontsLoaded: ((fonts: FontFaceSet) => void) | undefined;
    vi.spyOn(FontFaceSet.prototype, 'ready', 'get').mockReturnValue(
      new Promise<FontFaceSet>((resolve) => {
        fontsLoaded = resolve;
      }),
    );
    const main = document.createElement('main');
    main.id = 'main';
    const above = document.createElement('p');
    above.style.cssText = 'height: 1000px; margin: 0';
    const block = document.createElement('p');
    block.style.cssText = 'height: 3000px; margin: 0';
    main.append(above, block);
    document.body.append(main);
    sessionStorage.setItem(
      'locale-switch-position',
      JSON.stringify({ destination: '/en', block: 1, top: 100 }),
    );
    await renderHook(
      () => {
        useRestoredReadingPosition();
      },
      { wrapper: onPage('/en') },
    );

    // The web font replaces the fallback: the text above takes more room.
    above.style.height = '1040px';
    fontsLoaded?.(document.fonts);

    await expect.poll(() => Math.round(block.getBoundingClientRect().top)).toBe(100);
  });
});
