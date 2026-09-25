import { Link } from 'react-router';

import { FOOTER_LINKS, NAV_ITEMS } from '@/config/navigation';
import { PATHS } from '@/config/paths';

// Built from the same configuration as the header and footer, so it cannot drift from them
// (second navigation system, RGAA 12.1).
export function SiteMap() {
  return (
    <ul className="flex flex-col gap-3 [&_a]:inline-flex [&_a]:min-h-6 [&_a]:items-center">
      <li className="flex flex-col gap-2">
        <Link to={PATHS.home}>Accueil</Link>
        <ul className="flex flex-col gap-2 ps-6">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </li>
      {FOOTER_LINKS.map(({ label, path }) => (
        <li key={path}>
          <Link to={path}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}
