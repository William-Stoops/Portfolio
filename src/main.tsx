import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { ROUTES } from '@/app/routes';

import '@/styles/globals.css';

const rootElement = document.getElementById('root');

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('Missing #root element in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(ROUTES)} />
  </StrictMode>,
);
