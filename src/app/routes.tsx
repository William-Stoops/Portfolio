import { type RouteObject } from 'react-router';

import { HomeRoute } from '@/app/routes/home';
import { RootLayout } from '@/app/routes/root-layout';
import { RouteErrorBoundary } from '@/app/routes/route-error-boundary';
import { PATHS } from '@/config/paths';

// The home page is the LCP path and stays in the main chunk; every other page is split.
export const ROUTES: RouteObject[] = [
  {
    path: PATHS.home,
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: HomeRoute },
      {
        path: '*',
        lazy: {
          Component: async () => (await import('@/app/routes/not-found')).NotFoundRoute,
        },
      },
    ],
  },
];
