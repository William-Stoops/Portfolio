import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

import { type SiteContent } from '@/app/content/site-content';
import { SiteContentContext } from '@/app/content/site-content-context';
import { SITE_CONTENT as SITE_CONTENT_EN } from '@/app/content/site-content.en';
import { SITE_CONTENT as SITE_CONTENT_FR } from '@/app/content/site-content.fr';
import { ROUTES } from '@/app/routes';
import { LocaleContext } from '@/i18n/locale-context';
import { DEFAULT_LOCALE, type Localized } from '@/i18n/locales';
import { localeFromPathname } from '@/i18n/locale-from-pathname';
import { type RenderRoute } from '@/types/prerender';

// Build time only: both locales are at hand, the client loads one.
const SITE_CONTENTS: Localized<SiteContent> = { fr: SITE_CONTENT_FR, en: SITE_CONTENT_EN };

// Build-time only (scripts/prerender.ts): renders one route to HTML so the page is visible
// before any JavaScript runs, in the locale of its path. `hydrate={false}`: no route loads
// data, so no inline hydration script is needed, which keeps a strict Content-Security-Policy
// possible.
export const renderRoute: RenderRoute = async (path) => {
  const locale = localeFromPathname(path) ?? DEFAULT_LOCALE;
  const handler = createStaticHandler(ROUTES);
  const context = await handler.query(new Request(new URL(path, 'http://localhost')));

  if (context instanceof Response) {
    throw new Error(`Prerendering ${path} returned a response (redirect?), not a page`);
  }

  // prerender, not renderToString: it waits for the sections whose code loads later
  // (React.lazy), so the HTML carries them too (ADR 0020). Nothing is streamed: with no
  // chunk size limit every boundary stays inline, instead of being moved into place by
  // inline scripts, which would hide it without JavaScript and break a strict CSP.
  const { prelude } = await prerender(
    <StrictMode>
      <LocaleContext value={locale}>
        <SiteContentContext value={SITE_CONTENTS[locale]}>
          <StaticRouterProvider
            router={createStaticRouter(handler.dataRoutes, context)}
            context={context}
            hydrate={false}
          />
        </SiteContentContext>
      </LocaleContext>
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  );
  return new Response(prelude).text();
};
