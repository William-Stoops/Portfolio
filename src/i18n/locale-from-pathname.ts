// Relative import: loaded by Node through src/config/paths.ts (see there).
import { type Locale, localeSchema } from './locales.ts';

// The locale of a page is the first segment of its path: `/en/legal-notice` → en. The URL
// is a boundary: the segment is parsed, never cast.
export function localeFromPathname(pathname: string): Locale | undefined {
  const result = localeSchema.safeParse(pathname.split('/')[1]);
  return result.success ? result.data : undefined;
}
