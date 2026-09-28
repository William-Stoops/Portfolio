import { useLocation } from 'react-router';

import { alternateHref, anchorsOf } from '@/config/paths';
import { useLocale } from '@/i18n/locale-context';
import { type Locale, LOCALE_NAMES, LOCALES } from '@/i18n/locales';
import { storeLocalePreference } from '@/i18n/locale-preference';
import { readingLineY, rememberReadingPosition } from '@/lib/reading-position';

type LanguageOption = {
  locale: Locale;
  // In the language itself: readers look for their own language's name.
  name: string;
  href: string;
  // Called as the link is followed: remembers the choice, and the place being read, so the
  // other language opens exactly there.
  select: (link: HTMLAnchorElement) => void;
};

// The last anchored section whose top has passed the reading line: where the other
// language opens when the exact place cannot be remembered.
function anchorInView(locale: Locale, lineY: number): string | undefined {
  let inView: { id: string; top: number } | undefined;
  for (const id of Object.values(anchorsOf(locale))) {
    const top = document.getElementById(id)?.getBoundingClientRect().top;
    if (top !== undefined && top <= lineY && (inView === undefined || top > inView.top)) {
      inView = { id, top };
    }
  }
  return inView?.id;
}

// The same page in each other language (ADR 0026). A full navigation, not a client-side
// one: the other language's page is prerendered, with its own content chunk.
export function useLanguageSwitch(): readonly LanguageOption[] {
  const locale = useLocale();
  // Not the hash: the prerendered link cannot know it, and the hydrated one must match it.
  // The place being read is settled when the link is followed.
  const { pathname } = useLocation();

  return LOCALES.filter((other) => other !== locale).map((other) => {
    const destination = alternateHref(pathname, '', other);
    return {
      locale: other,
      name: LOCALE_NAMES[other],
      href: destination,
      select: (link) => {
        storeLocalePreference(other);
        const lineY = readingLineY();
        // No hash when the exact place is kept: the browser would first jump to the
        // section's top. Otherwise, the section itself.
        if (rememberReadingPosition(lineY, destination)) {
          link.href = destination;
          return;
        }
        const anchor = anchorInView(locale, lineY);
        if (anchor !== undefined) {
          link.href = alternateHref(pathname, `#${anchor}`, other);
        }
      },
    };
  });
}
