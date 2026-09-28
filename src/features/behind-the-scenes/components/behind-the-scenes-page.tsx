import { ExternalLink } from 'lucide-react';
import { type ReactNode, useId } from 'react';

import { DECISIONS_URL, REPOSITORY_URL } from '@/config/site';
import { LiveVitals } from '@/features/behind-the-scenes/components/live-vitals';
import { type BehindTheScenesContent } from '@/features/behind-the-scenes/types/behind-the-scenes-content';

type BehindTheScenesPageProps = { content: BehindTheScenesContent };

// How the site is made, for the readers of its code (ADR 0033): the measures of this very
// visit, what the CI turns down, the decisions, and the way to the public repository. The
// route sets the title; this is the body, in its own chunk.
export function BehindTheScenesPage({ content }: BehindTheScenesPageProps) {
  const { vitals, gates, decisions } = content;

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-4">
        <p className="text-lead text-fg-muted">{content.intro}</p>
        <p>
          <OutboundLink href={REPOSITORY_URL} newTab={content.newTab}>
            {content.repository}
          </OutboundLink>
        </p>
      </div>

      <TitledPart title={vitals.title}>
        <p className="text-fg-muted">{vitals.intro}</p>
        <LiveVitals content={vitals} />
      </TitledPart>

      <TitledPart title={gates.title}>
        <p className="text-fg-muted">{gates.intro}</p>
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {gates.items.map(({ title, text }) => (
            <li key={title} className="flex flex-col gap-2 border-t border-border pt-4">
              <h3 className="text-lead font-semibold">{title}</h3>
              <p className="text-fg-muted">{text}</p>
            </li>
          ))}
        </ul>
      </TitledPart>

      <TitledPart title={decisions.title}>
        <p className="text-fg-muted">{decisions.text}</p>
        <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-accent-fg">
          {decisions.highlights.map((highlight) => (
            <li key={highlight} className="text-fg-muted">
              {highlight}
            </li>
          ))}
        </ul>
        <p>
          <OutboundLink href={DECISIONS_URL} newTab={content.newTab}>
            {decisions.link}
          </OutboundLink>
        </p>
      </TitledPart>
    </div>
  );
}

// A part of the page under its own heading, named by it.
function TitledPart({ title, children }: { title: string; children: ReactNode }) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <h2 id={headingId} className="text-h3 font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

// A link to GitHub: a new tab, shown by its icon and said by its name.
function OutboundLink({
  href,
  newTab,
  children,
}: {
  href: string;
  newTab: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-6 items-center gap-2 font-semibold"
    >
      {children}
      <ExternalLink aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-4" />
      <span className="sr-only">{newTab}</span>
    </a>
  );
}
