import { ArrowRight } from 'lucide-react';
import { useId } from 'react';
import { Link } from 'react-router';

import { type NavItem, type PageLink } from '@/config/navigation';

type DestinationBoardProps = {
  title: string;
  // A page is a router link; a section of the home page, a plain fragment link, like the
  // main navigation's: the browser scrolls to it and moves the focus starting point there.
  destinations: readonly (NavItem | PageLink)[];
};

const ROW_CLASS_NAME =
  'group flex min-h-12 items-center justify-between gap-4 py-2 font-semibold text-fg no-underline transition-colors duration-150 hover:text-accent-fg';

// Where to go next, set like the rows of a departures board: one destination a row between
// hairlines, an arrow that leans forward on hover. Its own navigation, named by its title.
export function DestinationBoard({ title, destinations }: DestinationBoardProps) {
  const headingId = useId();

  return (
    <nav aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2
        id={headingId}
        className="text-small font-semibold tracking-[0.2em] text-fg-muted uppercase"
      >
        {title}
      </h2>
      <ul className="border-t border-border">
        {destinations.map((destination) => {
          const row = (
            <>
              {destination.label}
              <ArrowRight
                aria-hidden="true"
                focusable="false"
                strokeWidth={1.75}
                className="size-5 shrink-0 text-accent-fg transition-transform duration-250 ease-out group-hover:translate-x-1"
              />
            </>
          );
          return (
            <li key={destination.label} className="border-b border-border">
              {'path' in destination ? (
                <Link to={destination.path} className={ROW_CLASS_NAME}>
                  {row}
                </Link>
              ) : (
                <a href={destination.href} className={ROW_CLASS_NAME}>
                  {row}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
