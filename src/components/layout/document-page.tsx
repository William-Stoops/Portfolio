import { type ReactNode, type Ref } from 'react';

type DocumentPageProps = {
  title: string;
  // Owned by the route (usePageHeading): focus lands here after a client-side navigation.
  headingRef: Ref<HTMLHeadingElement>;
  children: ReactNode;
};

// Text pages (legal notice, accessibility statement, site map): one readable column.
export function DocumentPage({ title, headingRef, children }: DocumentPageProps) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-gutter py-section">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-h1 font-semibold focus-visible:outline-hidden"
      >
        {title}
      </h1>
      {children}
    </article>
  );
}
