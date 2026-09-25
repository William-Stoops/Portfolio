import { SITE_OWNER, SITE_TITLE } from '@/config/site';
import { usePageHeading } from '@/hooks/use-page-heading';

export function HomeRoute() {
  const headingRef = usePageHeading();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-4 px-gutter py-section">
      <title>{SITE_TITLE}</title>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-display font-semibold tracking-tight focus-visible:outline-hidden"
      >
        {SITE_OWNER}
      </h1>
      <p lang="en" className="text-lead text-fg-muted">
        Software Engineer &amp; AI Engineer
      </p>
    </div>
  );
}
