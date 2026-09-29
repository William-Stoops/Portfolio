import { ArrowDown, Menu as MenuIcon, X } from 'lucide-react';
import { Link } from 'react-router';

import { CommandPaletteTrigger } from '@/components/layout/command-palette-trigger';
import { LanguageSwitch } from '@/components/layout/language-switch';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NAV_ITEMS } from '@/config/navigation';
import { PAGE_PATHS } from '@/config/paths';
import { CV_FILE, SITE_OWNER } from '@/config/site';
import { useMenuDialog } from '@/hooks/use-menu-dialog';
import { useLocale, useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { cn } from '@/lib/cn';

type HeaderMessages = {
  menu: string;
  closeMenu: string;
  navigation: string;
  downloadCv: string;
};

const HEADER_MESSAGES: Localized<HeaderMessages> = {
  fr: {
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    navigation: 'Navigation principale',
    downloadCv: `Télécharger le CV (${CV_FILE.details.fr})`,
  },
  en: {
    menu: 'Menu',
    closeMenu: 'Close the menu',
    navigation: 'Main navigation',
    downloadCv: `Download my CV (${CV_FILE.details.en})`,
  },
};

type SiteHeaderProps = {
  // On the home page the bar lies over the hero's living field (ADR 0037); elsewhere it
  // opens the page on its own background.
  tone: 'page' | 'hero';
};

const TONE_CLASS_NAMES: Readonly<Record<SiteHeaderProps['tone'], string>> = {
  page: 'bg-canvas',
  hero: 'absolute inset-x-0 top-0 z-(--z-header)',
};

const BAR_LINK_CLASS_NAME =
  'inline-flex min-h-11 items-center font-medium text-fg no-underline decoration-1 underline-offset-4 hover:underline';

// White rounds on the field: the CV and the menu, the two things the bar lets you act on.
const PILL_CLASS_NAME =
  'inline-flex min-h-11 items-center gap-1.5 rounded-full bg-canvas font-medium text-fg no-underline transition-colors duration-250 hover:bg-accent hover:text-on-accent';

// A quiet bar that scrolls away with the page: the name, the sections on wide screens, the
// CV and the menu at every width. The menu holds the sections again for small screens, and
// the quick search, the theme and the other language for all.
export function SiteHeader({ tone }: SiteHeaderProps) {
  const locale = useLocale();
  const messages = useLocalized(HEADER_MESSAGES);
  const { isOpen, buttonRef, dialogRef, open, close, leave, handleClose } = useMenuDialog();

  return (
    <header className={cn('px-gutter', TONE_CLASS_NAMES[tone])}>
      <div className="mx-auto flex h-(--header-height) max-w-6xl items-center gap-8">
        <Link
          to={PAGE_PATHS[locale].home}
          className="me-auto inline-flex min-h-11 items-center font-semibold tracking-tight text-fg no-underline"
        >
          {SITE_OWNER}
        </Link>
        <nav aria-label={messages.navigation} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS[locale].map(({ label, href }) => (
              <li key={href}>
                <a href={href} className={BAR_LINK_CLASS_NAME}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={CV_FILE.href}
            download
            aria-label={messages.downloadCv}
            className={cn(PILL_CLASS_NAME, 'px-4')}
          >
            CV
            <ArrowDown aria-hidden="true" focusable="false" className="size-4" strokeWidth={2} />
          </a>
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onClick={open}
            className={cn(PILL_CLASS_NAME, 'size-11 justify-center')}
          >
            <MenuIcon aria-hidden="true" focusable="false" className="size-5" strokeWidth={2} />
            <span className="sr-only">{messages.menu}</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={messages.menu}
        onClose={handleClose}
        closedby="any"
        className="m-3 ms-auto w-[min(24rem,calc(100%-1.5rem))] menu-panel rounded-lg bg-canvas p-6 text-fg shadow-card backdrop:bg-canvas/60"
      >
        <div className="flex items-center justify-between gap-4">
          <p aria-hidden="true" className="text-small text-fg-muted">
            {messages.menu}
          </p>
          <button
            type="button"
            onClick={close}
            className="inline-grid size-11 place-items-center rounded-full text-fg transition-colors duration-250 hover:bg-surface-raised"
          >
            <X aria-hidden="true" focusable="false" className="size-5" strokeWidth={2} />
            <span className="sr-only">{messages.closeMenu}</span>
          </button>
        </div>
        <nav aria-label={messages.navigation} className="mt-2">
          <ul className="flex flex-col">
            {NAV_ITEMS[locale].map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={leave}
                  className="inline-flex min-h-12 items-center text-h3 font-medium text-fg no-underline hover:text-accent-fg"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          <CommandPaletteTrigger onOpen={leave} returnFocusTo={buttonRef} />
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </dialog>
    </header>
  );
}
