import { Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NAV_ITEMS } from '@/config/navigation';
import { PATHS } from '@/config/paths';
import { SITE_OWNER } from '@/config/site';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { cn } from '@/lib/cn';

const MENU_ID = 'menu-principal';

// Below 64rem the navigation and theme choice sit in a disclosure opened by "Menu"; from
// 64rem (where five links, the name and the theme choice fit on one row) they are shown
// inline and the button is gone. DOM order = visual order.
export function SiteHeader() {
  const { isOpen, toggle, close, buttonRef } = useMobileMenu();

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-gutter py-4">
      <Link
        to={PATHS.home}
        className="inline-flex min-h-11 items-center font-display text-h3 font-semibold text-fg no-underline"
      >
        {SITE_OWNER}
      </Link>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={MENU_ID}
        onClick={toggle}
        className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold lg:hidden"
      >
        {isOpen ? (
          <X aria-hidden="true" focusable="false" className="size-5" strokeWidth={1.75} />
        ) : (
          <MenuIcon aria-hidden="true" focusable="false" className="size-5" strokeWidth={1.75} />
        )}
        Menu
      </button>
      <div
        id={MENU_ID}
        className={cn(
          'basis-full flex-col items-start gap-2 pb-2 lg:flex lg:basis-auto lg:flex-row lg:items-center lg:gap-6 lg:pb-0',
          isOpen ? 'flex' : 'hidden',
        )}
      >
        <nav aria-label="Navigation principale">
          <ul className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={close}
                  className="inline-flex min-h-11 items-center font-semibold text-fg no-underline hover:text-accent-fg"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
