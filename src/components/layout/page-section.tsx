import { type ReactNode } from 'react';

type PageSectionProps = {
  // Fragment id of the section (see SECTION_IDS); the heading id derives from it.
  id: string;
  title: string;
  // Optional introduction, kept close to the heading.
  lead?: ReactNode;
  children: ReactNode;
};

// Every home page section: a region named by its h2, reachable by its anchor, on the
// shared content column and vertical rhythm.
export function PageSection({ id, title, lead, children }: PageSectionProps) {
  const headingId = `${id}-titre`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-gutter py-section"
    >
      <div className="flex flex-col gap-4">
        <h2 id={headingId} className="text-h2 font-semibold">
          {title}
        </h2>
        {lead}
      </div>
      {children}
    </section>
  );
}
