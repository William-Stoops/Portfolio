import { Languages } from 'lucide-react';

import { useLanguageSwitch } from '@/hooks/use-language-switch';

// The same page in the other language, named in that language: "English", "Français".
// Its visible text is its accessible name (WCAG 2.5.3), and `lang` has screen readers say
// it in its own language. No flag: a flag is a country, not a language.
export function LanguageSwitch() {
  const options = useLanguageSwitch();

  return options.map(({ locale, name, href, select }) => (
    <a
      key={locale}
      href={href}
      hrefLang={locale}
      lang={locale}
      onClick={(event) => {
        select(event.currentTarget);
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-semibold text-fg-muted no-underline transition-colors duration-150 hover:bg-surface-raised hover:text-fg"
    >
      <Languages aria-hidden="true" focusable="false" className="size-5" strokeWidth={1.75} />
      {name}
    </a>
  ));
}
