import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { ROUTES } from '@/app/routes';

import '@/styles/globals.css';

const rootElement = document.getElementById('root');

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('Missing #root element in index.html');
}

const app = (
  <StrictMode>
    <RouterProvider router={createBrowserRouter(ROUTES)} />
  </StrictMode>
);

// Built pages arrive prerendered (scripts/prerender.ts) and are hydrated; the dev server
// serves the bare template, which is rendered from scratch.
if (rootElement.firstElementChild === null) {
  createRoot(rootElement).render(app);
} else {
  hydrateRoot(rootElement, app);
}
