import { Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router';

import { CommandPaletteTrigger } from '@/components/layout/command-palette-trigger';
import { LanguageSwitch } from '@/components/layout/language-switch';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NAV_ITEMS } from '@/config/navigation';
import { PAGE_PATHS } from '@/config/paths';
import { SITE_OWNER } from '@/config/site';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { useLocale, useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { cn } from '@/lib/cn';

const MENU_ID = 'menu-principal';

const HEADER_MESSAGES: Localized<{ menu: string; navigation: string }> = {
  fr: { menu: 'Menu', navigation: 'Navigation principale' },
  en: { menu: 'Menu', navigation: 'Main navigation' },
};

// Below 64rem the navigation, the quick search, the theme choice and the language switch sit
// in a disclosure opened by "Menu"; from 64rem (where five links, the name and every choice
// fit on one row, a little closer until 80rem) they are shown inline and the
// button is gone. DOM order = visual order.
export function SiteHeader() {
  const { isOpen, toggle, close, buttonRef } = useMobileMenu();
  const locale = useLocale();
  const messages = useLocalized(HEADER_MESSAGES);

  return (
    // Sticky, except on short screens (landscape phones, 400 % zoom) where it would eat the
    // viewport. The rule under it and the reading progress are scroll-driven (motion.css).
    <header className="sticky top-0 z-(--z-header) bg-canvas short:static">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px scroll-settle bg-border"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px scroll-progress h-0.5 bg-accent"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-gutter py-4 xl:gap-x-6">
        <Link
          to={PAGE_PATHS[locale].home}
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
          {messages.menu}
        </button>
        <div
          id={MENU_ID}
          className={cn(
            'basis-full flex-col items-start gap-2 pb-2 lg:flex lg:basis-auto lg:flex-row lg:items-center lg:gap-4 lg:pb-0 xl:gap-6',
            isOpen ? 'flex' : 'hidden',
          )}
        >
          <nav aria-label={messages.navigation}>
            <ul className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-4 xl:gap-x-6">
              {NAV_ITEMS[locale].map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={close}
                    className="relative inline-flex min-h-11 items-center font-semibold text-fg no-underline after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-250 after:ease-out hover:text-accent-fg hover:after:scale-x-100"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <CommandPaletteTrigger />
            <ThemeToggle />
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
