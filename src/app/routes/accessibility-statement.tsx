import { DocumentPage } from '@/components/layout/document-page';
import { AccessibilityStatement } from '@/features/legal/components/accessibility-statement';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

export function AccessibilityStatementRoute() {
  const headingRef = usePageHeading();

  return (
    <>
      <title>{formatPageTitle('Déclaration d’accessibilité')}</title>
      <DocumentPage title="Déclaration d’accessibilité" headingRef={headingRef}>
        <AccessibilityStatement />
      </DocumentPage>
    </>
  );
}
