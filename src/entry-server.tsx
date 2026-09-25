import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

import { ROUTES } from '@/app/routes';
import { type RenderRoute } from '@/types/prerender';

// Build-time only (scripts/prerender.ts): renders one route to HTML so the page is visible
// before any JavaScript runs. `hydrate={false}`: no route loads data, so no inline hydration
// script is needed, which keeps a strict Content-Security-Policy possible.
export const renderRoute: RenderRoute = async (path) => {
  const handler = createStaticHandler(ROUTES);
  const context = await handler.query(new Request(new URL(path, 'http://localhost')));

  if (context instanceof Response) {
    throw new Error(`Prerendering ${path} returned a response (redirect?), not a page`);
  }

  return renderToString(
    <StrictMode>
      <StaticRouterProvider
        router={createStaticRouter(handler.dataRoutes, context)}
        context={context}
        hydrate={false}
      />
    </StrictMode>,
  );
};
