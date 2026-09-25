import { Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NAV_ITEMS } from '@/config/navigation';
import { PATHS } from '@/config/paths';
import { SITE_OWNER } from '@/config/site';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { cn } from '@/lib/cn';

const MENU_ID = 'menu-principal';

// Below 48rem the navigation and theme choice sit in a disclosure opened by "Menu"; from
// 48rem they are always shown inline and the button is gone. DOM order = visual order.
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
        className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-semibold md:hidden"
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
          'basis-full flex-col items-start gap-2 pb-2 md:flex md:basis-auto md:flex-row md:items-center md:gap-6 md:pb-0',
          isOpen ? 'flex' : 'hidden',
        )}
      >
        <nav aria-label="Navigation principale">
          <ul className="flex flex-col md:flex-row md:flex-wrap md:items-center md:gap-x-6">
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
