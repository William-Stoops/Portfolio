import { lazy, Suspense } from 'react';

import { useSiteContent } from '@/app/content/site-content-context';
import { DocumentPage } from '@/components/layout/document-page';
import { PageMetadata } from '@/components/layout/page-metadata';
import { usePageHeading } from '@/hooks/use-page-heading';
import { formatPageTitle } from '@/utils/format-page-title';

// The page's body is its own chunk, loaded with the page: the prerender waits for it, so
// its HTML is there from the start, and the client hydrates it as it arrives (ADR 0020).
// The route itself stays synchronous, as a prerendered page's must.
const BehindTheScenesPage = lazy(() =>
  import('@/features/behind-the-scenes/components/behind-the-scenes-page').then(
    ({ BehindTheScenesPage: page }) => ({ default: page }),
  ),
);

export function BehindTheScenesRoute() {
  const headingRef = usePageHeading();
  const { behindTheScenes } = useSiteContent();

  return (
    <>
      <PageMetadata
        title={formatPageTitle(behindTheScenes.title)}
        description={behindTheScenes.description}
      />
      <DocumentPage title={behindTheScenes.title} headingRef={headingRef}>
        <Suspense>
          <BehindTheScenesPage content={behindTheScenes} />
        </Suspense>
      </DocumentPage>
    </>
  );
}
