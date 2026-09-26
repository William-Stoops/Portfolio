import { Outlet, ScrollRestoration } from 'react-router';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { useDesktopEnhancements } from '@/hooks/use-desktop-enhancements';
import { usePointerGlow } from '@/hooks/use-pointer-glow';
import { useProgressiveRender } from '@/hooks/use-progressive-render';

export function RootLayout() {
  usePointerGlow();
  useDesktopEnhancements();
  useProgressiveRender();

  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteHeader />
      {/* tabIndex={-1}: target of the skip link; the outline would frame the whole page. */}
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus-visible:outline-hidden">
        <Outlet />
      </main>
      <SiteFooter />
      {/*
        Keyed by path and fragment: every freshly loaded document shares the router key
        "default", so restoring by key would apply the previous page's scroll position and
        undo the browser's jump to a fragment such as /#a-propos.
      */}
      <ScrollRestoration getKey={({ pathname, hash }) => `${pathname}${hash}`} />
    </div>
  );
}
