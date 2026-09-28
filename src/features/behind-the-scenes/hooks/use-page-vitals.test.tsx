import { type ReactNode, useEffect, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { usePageVitals } from '@/features/behind-the-scenes/hooks/use-page-vitals';

afterEach(() => {
  vi.restoreAllMocks();
});

// Something to paint: a page that has painted nothing has no first contentful paint.
function Painted({ children }: { children: ReactNode }) {
  return (
    <>
      <p>Mesures de la page</p>
      {children}
    </>
  );
}

// A page that shifts once it has painted: a block pushed in above its text, with no input
// to explain it, moves the text down.
function Shifting({ children }: { children: ReactNode }) {
  const [isPushed, setIsPushed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPushed(true);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      {isPushed ? <div style={{ height: 240 }} /> : null}
      <p>Mesures de la page</p>
      {children}
    </>
  );
}

describe('usePageVitals', () => {
  it('reads the vitals of this very page from the browser', async () => {
    const { result } = await renderHook(() => usePageVitals(), { wrapper: Painted });

    await expect.poll(() => result.current.firstContentfulPaint).toEqual(expect.any(Number));
    await expect.poll(() => result.current.largestContentfulPaint).toEqual(expect.any(Number));
    expect(result.current.cumulativeLayoutShift).toEqual(expect.any(Number));
    await expect.poll(() => result.current.javascriptBytes).toBeGreaterThan(0);
    expect(result.current.requests).toBeGreaterThan(1);
  });

  it('adds up the layout shifts the page makes', async () => {
    const { result } = await renderHook(() => usePageVitals(), { wrapper: Shifting });

    await expect
      .poll(() => result.current.cumulativeLayoutShift, { timeout: 5000 })
      .toBeGreaterThan(0);
  });

  it('says what this browser does not measure', async () => {
    vi.spyOn(PerformanceObserver, 'supportedEntryTypes', 'get').mockReturnValue([
      'paint',
      'resource',
    ]);

    const { result } = await renderHook(() => usePageVitals(), { wrapper: Painted });

    await expect.poll(() => result.current.largestContentfulPaint).toBe('unsupported');
    expect(result.current.cumulativeLayoutShift).toBe('unsupported');
  });

  it('leaves out the paints of a page opened in the background', async () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');

    const { result } = await renderHook(() => usePageVitals(), { wrapper: Painted });

    await expect.poll(() => result.current.firstContentfulPaint).toBe('background');
    await expect.poll(() => result.current.javascriptBytes).toBeGreaterThan(0);
  });

  it('stops listening when the page leaves, and starts afresh when it comes back', async () => {
    const disconnect = vi.spyOn(PerformanceObserver.prototype, 'disconnect');
    const first = await renderHook(() => usePageVitals(), { wrapper: Painted });
    await expect.poll(() => first.result.current.firstContentfulPaint).toEqual(expect.any(Number));

    await first.unmount();

    expect(disconnect).toHaveBeenCalled();
    const second = await renderHook(() => usePageVitals(), { wrapper: Painted });
    await expect.poll(() => second.result.current.firstContentfulPaint).toEqual(expect.any(Number));
  });
});
