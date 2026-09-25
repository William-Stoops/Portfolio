import { type RouteObject } from 'react-router';

import { HomeRoute } from '@/app/routes/home';
import { NotFoundRoute } from '@/app/routes/not-found';
import { RootLayout } from '@/app/routes/root-layout';
import { RouteErrorBoundary } from '@/app/routes/route-error-boundary';
import { PATHS } from '@/config/paths';

// Prerendered pages hydrate synchronously, so the routes they match must not be lazy
// (guarded by scripts/prerender-pages.test.ts). Split only heavy, non-prerendered routes.
export const ROUTES: RouteObject[] = [
  {
    path: PATHS.home,
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: HomeRoute },
      { path: '*', Component: NotFoundRoute },
    ],
  },
];
