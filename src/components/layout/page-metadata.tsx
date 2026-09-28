type PageMetadataProps = { title: string; description?: string };

// Rendered by each route in its own language; React 19 hoists both into the <head>, and the
// prerender moves them there in the static HTML (scripts/inject-rendered-page.ts).
export function PageMetadata({ title, description }: PageMetadataProps) {
  return (
    <>
      <title>{title}</title>
      {description === undefined ? null : <meta name="description" content={description} />}
    </>
  );
}
