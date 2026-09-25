import { Outlet, ScrollRestoration } from 'react-router';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteHeader />
      {/* tabIndex={-1}: target of the skip link; the outline would frame the whole page. */}
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus-visible:outline-hidden">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  );
}
