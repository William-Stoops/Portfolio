import { type ReactNode } from 'react';

type LegalBlockProps = { title: string; children: ReactNode };

// One titled part of a legal page, with the prose rhythm shared by those pages.
export function LegalBlock({ title, children }: LegalBlockProps) {
  return (
    <section className="flex flex-col gap-3 text-fg-muted [&_li]:ms-5 [&_li]:list-disc [&_strong]:text-fg">
      <h2 className="text-h3 font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}
