import { FOOTER_LINKS, HOME_LINK, NAV_ITEMS } from '@/config/navigation';
import { CONTACT_EMAIL, CV_FILE, LINKEDIN_URL } from '@/config/site';
import { useLanguageSwitch } from '@/hooks/use-language-switch';
import { type ThemePreference, useThemePreference } from '@/hooks/use-theme-preference';
import { useLocale } from '@/i18n/locale-context';
import { type Locale } from '@/i18n/locales';

export type PaletteGroup = 'sections' | 'pages' | 'actions';

type EntryText = {
  id: string;
  group: PaletteGroup;
  label: string;
  // Other words it answers to: "apparence" finds the themes.
  keywords: string;
};

// What a result is, so it is the right element: a link goes somewhere (a section, another
// language, a file), a route is a page of the site (a router link), an action acts in place
// (a button).
export type PaletteEntry =
  | (EntryText & {
      kind: 'link';
      href: string;
      // The other language's page, named in that language.
      lang?: Locale;
      // The CV: saved, not opened.
      download?: boolean;
      // LinkedIn: another site, in a new tab, and said so.
      newTab?: boolean;
      // Called as the link is followed, before the browser goes (the reading position).
      onFollow?: (link: HTMLAnchorElement) => void;
    })
  | (EntryText & { kind: 'route'; path: string })
  | (EntryText & { kind: 'action'; run: () => void });

type ActionText = { label: string; keywords: string };

export type PaletteActions = {
  themes: Readonly<Record<ThemePreference, ActionText>>;
  // The switch is named in the other language; only the words that find it are needed.
  languageKeywords: string;
  downloadCv: ActionText;
  email: ActionText;
  linkedin: ActionText;
};

const THEMES = ['light', 'dark', 'system'] as const satisfies readonly ThemePreference[];

// Everything the quick search offers, in the order it lists them: the home page's
// sections, the site's pages, then the choices and the links of the header and the footer.
export function usePaletteCommands(actions: PaletteActions): PaletteEntry[] {
  const locale = useLocale();
  const { setThemePreference } = useThemePreference();
  const languages = useLanguageSwitch();

  // Sections are plain fragment links, like the main navigation's: the browser scrolls to
  // the anchor and moves the focus starting point there, from any page.
  const sections = NAV_ITEMS[locale].map(({ label, href }): PaletteEntry => ({
    kind: 'link',
    id: `section:${href}`,
    group: 'sections',
    label,
    keywords: '',
    href,
  }));
  const pages = [HOME_LINK[locale], ...FOOTER_LINKS[locale]].map(
    ({ label, path }): PaletteEntry => ({
      kind: 'route',
      id: `page:${path}`,
      group: 'pages',
      label,
      keywords: '',
      path,
    }),
  );
  const themes = THEMES.map((theme): PaletteEntry => ({
    kind: 'action',
    id: `theme:${theme}`,
    group: 'actions',
    label: actions.themes[theme].label,
    keywords: actions.themes[theme].keywords,
    run: () => {
      setThemePreference(theme);
    },
  }));
  // The same page in the other language, where the reader is, as the header's switch goes.
  const switches = languages.map(({ locale: other, name, href, select }): PaletteEntry => ({
    kind: 'link',
    id: `language:${other}`,
    group: 'actions',
    label: name,
    keywords: actions.languageKeywords,
    href,
    lang: other,
    onFollow: select,
  }));

  return [
    ...sections,
    ...pages,
    ...themes,
    ...switches,
    {
      kind: 'link',
      id: 'cv',
      group: 'actions',
      ...actions.downloadCv,
      href: CV_FILE.href,
      download: true,
    },
    {
      kind: 'link',
      id: 'email',
      group: 'actions',
      ...actions.email,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      kind: 'link',
      id: 'linkedin',
      group: 'actions',
      ...actions.linkedin,
      href: LINKEDIN_URL,
      newTab: true,
    },
  ];
}
