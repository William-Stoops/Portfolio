import { type RouteObject } from 'react-router';

import { AccessibilityStatementRoute } from '@/app/routes/accessibility-statement';
import { HomeRoute } from '@/app/routes/home';
import { LegalNoticeRoute } from '@/app/routes/legal-notice';
import { NotFoundRoute } from '@/app/routes/not-found';
import { RootLayout } from '@/app/routes/root-layout';
import { RouteErrorBoundary } from '@/app/routes/route-error-boundary';
import { SiteMapRoute } from '@/app/routes/site-map';
import { PAGE_PATHS } from '@/config/paths';
import { type Locale, LOCALES } from '@/i18n/locales';

// The same pages under each locale, at their translated paths (ADR 0026).
function localeRoutes(locale: Locale): RouteObject {
  const paths = PAGE_PATHS[locale];
  return {
    path: paths.home,
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: HomeRoute },
      { path: paths.accessibility, Component: AccessibilityStatementRoute },
      { path: paths.legalNotice, Component: LegalNoticeRoute },
      { path: paths.siteMap, Component: SiteMapRoute },
      { path: '*', Component: NotFoundRoute },
    ],
  };
}

// Prerendered pages hydrate synchronously, so the routes they match must not be lazy
// (guarded by scripts/prerender-pages.test.ts). Split only heavy, non-prerendered routes.
export const ROUTES: RouteObject[] = [
  ...LOCALES.map((locale) => localeRoutes(locale)),
  // Outside every locale (`/404`, an address with no locale): the default locale's page.
  {
    path: '*',
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [{ path: '*', Component: NotFoundRoute }],
  },
];
