import { Link } from 'react-router';

import { type NavItem, type PageLink } from '@/config/navigation';

type SiteMapProps = {
  home: PageLink;
  // The same lists as the header and the footer, so the map cannot drift from them (second
  // navigation system, RGAA 12.1).
  sections: readonly NavItem[];
  pages: readonly PageLink[];
};

export function SiteMap({ home, sections, pages }: SiteMapProps) {
  return (
    <ul className="flex flex-col gap-3 [&_a]:inline-flex [&_a]:min-h-6 [&_a]:items-center">
      <li className="flex flex-col gap-2">
        <Link to={home.path}>{home.label}</Link>
        <ul className="flex flex-col gap-2 ps-6">
          {sections.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </li>
      {pages.map(({ label, path }) => (
        <li key={path}>
          <Link to={path}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}
