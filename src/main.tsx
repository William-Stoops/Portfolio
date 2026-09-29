import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { loadSiteContent } from '@/app/content/load-site-content';
import { SiteContentContext } from '@/app/content/site-content-context';
import { ROUTES } from '@/app/routes';
import { LocaleContext } from '@/i18n/locale-context';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import { localeFromPathname } from '@/i18n/locale-from-pathname';

import '@/styles/globals.css';

const rootElement = document.getElementById('root');

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('Missing #root element in index.html');
}

// One document, one locale (ADR 0026): read once from the URL. Its content chunk is
// preloaded by the prerendered HTML, so the wait below costs no extra round trip. Awaited in
// a function, not at the top level: top-level await turns off the bundler's chunk merging.
const PAGE_LOCALE = localeFromPathname(window.location.pathname) ?? DEFAULT_LOCALE;

async function boot(root: HTMLElement): Promise<void> {
  const content = await loadSiteContent(PAGE_LOCALE);
  // Prerendered pages already carry it; the dev server serves one template for every locale.
  // Set only where it differs: rewritten, even to its own value, it restyled the whole page.
  if (document.documentElement.lang !== PAGE_LOCALE) {
    document.documentElement.lang = PAGE_LOCALE;
  }

  const app = (
    <StrictMode>
      <LocaleContext value={PAGE_LOCALE}>
        <SiteContentContext value={content}>
          <RouterProvider router={createBrowserRouter(ROUTES)} />
        </SiteContentContext>
      </LocaleContext>
    </StrictMode>
  );

  // Built pages arrive prerendered (scripts/prerender.ts) and are hydrated; the dev server
  // serves the bare template, which is rendered from scratch.
  if (root.firstElementChild === null) {
    createRoot(root).render(app);
  } else {
    hydrateRoot(root, app);
  }
}

// Without its content the page stays as prerendered: readable, only not interactive.
void boot(rootElement);
