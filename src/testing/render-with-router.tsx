import { type ReactNode } from 'react';
import { createMemoryRouter, type RouteObject, RouterProvider } from 'react-router';
import { render, type RenderResult } from 'vitest-browser-react';

import { LocaleContext } from '@/i18n/locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';

type RenderOptions = { path?: string; locale?: Locale };

export function renderRoutes(
  routes: RouteObject[],
  { path = '/', locale = DEFAULT_LOCALE }: RenderOptions = {},
): Promise<RenderResult> {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <LocaleContext value={locale}>
      <RouterProvider router={router} />
    </LocaleContext>,
  );
}

export function renderInRouter(ui: ReactNode, options?: RenderOptions): Promise<RenderResult> {
  return renderRoutes([{ path: '*', element: ui }], options);
}
