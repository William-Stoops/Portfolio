import { DocumentPage } from '@/components/layout/document-page';
import { LegalNotice } from '@/features/legal/components/legal-notice';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

export function LegalNoticeRoute() {
  const headingRef = usePageHeading();

  return (
    <>
      <title>{formatPageTitle('Mentions légales')}</title>
      <DocumentPage title="Mentions légales" headingRef={headingRef}>
        <LegalNotice />
      </DocumentPage>
    </>
  );
}
