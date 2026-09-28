import { useSiteContent } from '@/app/content/site-content-context';
import { DocumentPage } from '@/components/layout/document-page';
import { PageMetadata } from '@/components/layout/page-metadata';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

export function LegalNoticeRoute() {
  const headingRef = usePageHeading();
  const { legalNotice } = useSiteContent();

  return (
    <>
      <PageMetadata
        title={formatPageTitle(legalNotice.title)}
        description={legalNotice.description}
      />
      <DocumentPage title={legalNotice.title} headingRef={headingRef}>
        {legalNotice.notice}
      </DocumentPage>
    </>
  );
}
