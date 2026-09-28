import { anchorsOf, PAGE_PATHS } from '../src/config/paths.ts';
import { SITE_TITLE } from '../src/config/site.ts';
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES } from '../src/i18n/locales.ts';
import { LOCALE_STORAGE_KEY } from '../src/i18n/locale-preference.ts';

// Each anchor, in any locale, with its id in every locale: `parcours` → { fr, en }.
function anchorTranslations(): Record<string, Record<string, string>> {
  const translations: Record<string, Record<string, string>> = {};
  for (const locale of LOCALES) {
    for (const [key, id] of Object.entries(anchorsOf(locale))) {
      translations[id] = Object.fromEntries(
        LOCALES.map((target) => [target, anchorsOf(target)[key] ?? '']),
      );
    }
  }
  return translations;
}

// The gateway's choice (ADR 0026): the visitor's stored choice, else the first of their
// browser languages we speak (`en-GB` → en), else French. An inline script: it runs before
// anything is painted, without the app bundle; locale-gateway.test.ts runs it on every case.
function gatewayScript(): string {
  const homes = Object.fromEntries(LOCALES.map((locale) => [locale, PAGE_PATHS[locale].home]));
  return `(function () {
  var locales = ${JSON.stringify(LOCALES)};
  var homes = ${JSON.stringify(homes)};
  var anchors = ${JSON.stringify(anchorTranslations())};
  var locale = null;
  try {
    var stored = localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});
    if (locales.indexOf(stored) !== -1) locale = stored;
  } catch (error) {}
  var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  for (var i = 0; locale === null && i < languages.length; i++) {
    var primary = String(languages[i]).toLowerCase().split('-')[0];
    if (locales.indexOf(primary) !== -1) locale = primary;
  }
  if (locale === null) locale = ${JSON.stringify(DEFAULT_LOCALE)};
  var anchor = anchors[location.hash.slice(1)];
  location.replace(homes[locale] + location.search + (anchor ? '#' + anchor[locale] : ''));
})();`;
}

// `/`, the x-default (ADR 0026): about 1 kB, no bundle. It picks the visitor's locale
// before first paint and replaces the URL; without JavaScript, it refreshes to French and
// offers both languages. A Content-Security-Policy must allow its script's hash.
export function renderLocaleGateway(): string {
  const links = LOCALES.map(
    (locale) =>
      `<li><a href="${PAGE_PATHS[locale].home}" hreflang="${locale}" lang="${locale}">${LOCALE_NAMES[locale]}</a></li>`,
  ).join('');
  return `<!doctype html>
<html lang="${DEFAULT_LOCALE}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <title>${SITE_TITLE.replace('&', '&amp;')}</title>
    <script>${gatewayScript()}</script>
    <noscript><meta http-equiv="refresh" content="0; url=${PAGE_PATHS[DEFAULT_LOCALE].home}"></noscript>
  </head>
  <body>
    <main><ul>${links}</ul></main>
  </body>
</html>
`;
}
