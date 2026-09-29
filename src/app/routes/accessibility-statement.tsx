import { useSiteContent } from '@/app/content/site-content-context';
import { DocumentPage } from '@/components/layout/document-page';
import { PageMetadata } from '@/components/layout/page-metadata';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

export function AccessibilityStatementRoute() {
  const headingRef = usePageHeading();
  const { accessibility } = useSiteContent();

  return (
    <>
      <PageMetadata
        title={formatPageTitle(accessibility.title)}
        description={accessibility.description}
      />
      <DocumentPage title={accessibility.title} headingRef={headingRef}>
        {accessibility.statement}
      </DocumentPage>
    </>
  );
}
