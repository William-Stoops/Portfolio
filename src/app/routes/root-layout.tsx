import { Outlet, ScrollRestoration, useMatch } from 'react-router';

import { CommandPaletteHost } from '@/components/layout/command-palette-host';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { PAGE_PATHS } from '@/config/paths';
import { useCommandPaletteShortcut } from '@/hooks/use-command-palette-shortcut';
import { useDesktopEnhancements } from '@/hooks/use-desktop-enhancements';
import { usePointerGlow } from '@/hooks/use-pointer-glow';
import { useLocale } from '@/i18n/locale-context';
import { isArrivingAtReadingPosition } from '@/lib/reading-position';
import { useProgressiveRender } from '@/hooks/use-progressive-render';
import { useRestoredReadingPosition } from '@/hooks/use-restored-reading-position';

export function RootLayout() {
  usePointerGlow();
  useDesktopEnhancements();
  useProgressiveRender();
  useRestoredReadingPosition();
  useCommandPaletteShortcut();
  // The home page opens on the hero's living field, and the bar lies over it.
  const isHome = useMatch(PAGE_PATHS[useLocale()].home) !== null;

  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteHeader tone={isHome ? 'hero' : 'page'} />
      {/* tabIndex={-1}: target of the skip link; the outline would frame the whole page. */}
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus-visible:outline-hidden">
        <Outlet />
      </main>
      <SiteFooter />
      <CommandPaletteHost />
      {/*
        Keyed by path and fragment: every freshly loaded document shares the router key
        "default", so restoring by key would apply the previous page's scroll position and
        undo the browser's jump to a fragment such as /fr#a-propos. A page opened from the
        other language gets a key never saved: the router then restores nothing, and the
        place being read wins (useRestoredReadingPosition).
      */}
      <ScrollRestoration
        getKey={({ pathname, hash }) =>
          isArrivingAtReadingPosition(pathname)
            ? `${pathname}${hash}:from-the-other-language`
            : `${pathname}${hash}`
        }
      />
    </div>
  );
}
