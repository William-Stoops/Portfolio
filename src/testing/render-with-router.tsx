import { type ReactNode } from 'react';
import { createMemoryRouter, type RouteObject, RouterProvider } from 'react-router';
import { render, type RenderResult } from 'vitest-browser-react';

export function renderRoutes(routes: RouteObject[], initialPath = '/'): Promise<RenderResult> {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return render(<RouterProvider router={router} />);
}

export function renderInRouter(ui: ReactNode): Promise<RenderResult> {
  return renderRoutes([{ path: '*', element: ui }]);
}
