import { useSiteContent } from '@/app/content/site-content-context';
import { DocumentPage } from '@/components/layout/document-page';
import { PageMetadata } from '@/components/layout/page-metadata';
import { FOOTER_LINKS, NAV_ITEMS } from '@/config/navigation';
import { PAGE_PATHS } from '@/config/paths';
import { SiteMap } from '@/features/legal/components/site-map';
import { usePageHeading } from '@/hooks/use-page-heading';
import { useLocale } from '@/i18n/locale-context';
import { formatPageTitle } from '@/utils/format-page-title';

export function SiteMapRoute() {
  const headingRef = usePageHeading();
  const locale = useLocale();
  const { siteMap } = useSiteContent();

  return (
    <>
      <PageMetadata title={formatPageTitle(siteMap.title)} description={siteMap.description} />
      <DocumentPage title={siteMap.title} headingRef={headingRef}>
        <SiteMap
          home={{ label: siteMap.homeLabel, path: PAGE_PATHS[locale].home }}
          sections={NAV_ITEMS[locale]}
          pages={FOOTER_LINKS[locale]}
        />
      </DocumentPage>
    </>
  );
}
