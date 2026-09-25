import { DocumentPage } from '@/components/layout/document-page';
import { SiteMap } from '@/features/legal/components/site-map';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

export function SiteMapRoute() {
  const headingRef = usePageHeading();

  return (
    <>
      <title>{formatPageTitle('Plan du site')}</title>
      <DocumentPage title="Plan du site" headingRef={headingRef}>
        <SiteMap />
      </DocumentPage>
    </>
  );
}
