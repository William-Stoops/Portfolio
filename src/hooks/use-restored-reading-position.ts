import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

import { realignReadingPosition, restoreReadingPosition } from '@/lib/reading-position';

type ReadingAnchor = NonNullable<ReturnType<typeof restoreReadingPosition>>;

// Fonts arriving late change the heights above the block, and Safari does not anchor the
// scroll: realign once they are in, unless the reader has scrolled meanwhile.
async function realignOnceFontsAreIn(
  anchor: ReadingAnchor,
  restoredScrollY: number,
): Promise<void> {
  await document.fonts.ready;
  if (window.scrollY === restoredScrollY) {
    realignReadingPosition(anchor);
  }
}

// After hydration, React Router resets the scroll of a page opened without a hash: put the
// place the reader came from back, in the same frame (a layout effect of the root layout,
// which runs after the router's own). The inline script of index.html placed it already
// before the first paint.
export function useRestoredReadingPosition(): void {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const anchor = restoreReadingPosition(pathname);
    if (anchor === undefined) {
      return;
    }
    void realignOnceFontsAreIn(anchor, window.scrollY);
  }, [pathname]);
}
