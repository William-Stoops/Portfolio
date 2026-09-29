import { type SiteContent } from '@/app/content/site-content';
import { type Locale } from '@/i18n/locales';

// One chunk per locale (ADR 0026): a visitor downloads only their page's language. The
// prerendered HTML preloads it (scripts/prerender.ts), so hydration waits for no extra
// round trip.
export async function loadSiteContent(locale: Locale): Promise<SiteContent> {
  switch (locale) {
    case 'fr': {
      return (await import('@/app/content/site-content.fr')).SITE_CONTENT;
    }
    case 'en': {
      return (await import('@/app/content/site-content.en')).SITE_CONTENT;
    }
  }
}
