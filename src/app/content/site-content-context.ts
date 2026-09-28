import { createContext, use } from 'react';

import { type SiteContent } from '@/app/content/site-content';

// Provided once, around the whole app, by main.tsx and entry-server.tsx: the content of the
// page's locale. No default: a page without its content is a bug, not a fallback.
export const SiteContentContext = createContext<SiteContent | null>(null);

export function useSiteContent(): SiteContent {
  const content = use(SiteContentContext);
  if (content === null) {
    throw new Error('useSiteContent must be used inside a SiteContentContext provider');
  }
  return content;
}
