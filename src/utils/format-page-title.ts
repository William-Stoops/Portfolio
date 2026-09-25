import { SITE_OWNER } from '@/config/site';

export function formatPageTitle(pageName: string): string {
  return `${pageName} – ${SITE_OWNER}`;
}
