import { type KeyboardEvent, type ReactNode, useId } from 'react';
import { Link } from 'react-router';

import { CV_FILE } from '@/config/site';
import { closeCommandPalette } from '@/hooks/use-command-palette';
import {
  type PaletteActions,
  type PaletteEntry,
  type PaletteGroup,
  usePaletteCommands,
} from '@/hooks/use-palette-commands';
import { usePaletteDialog } from '@/hooks/use-palette-dialog';
import { usePaletteSearch } from '@/hooks/use-palette-search';
import { useLocalized } from '@/i18n/locale-context';
import { INTL_LOCALES, type Localized } from '@/i18n/locales';

type PaletteMessages = {
  title: string;
  label: string;
  placeholder: string;
  close: string;
  groups: Readonly<Record<PaletteGroup, string>>;
  empty: (query: string) => string;
  count: (count: number) => string;
  actions: PaletteActions;
};

const PLURALS = {
  fr: new Intl.PluralRules(INTL_LOCALES.fr),
  en: new Intl.PluralRules(INTL_LOCALES.en),
} as const satisfies Localized<Intl.PluralRules>;

const PALETTE_MESSAGES: Localized<PaletteMessages> = {
  fr: {
    title: 'Recherche rapide',
    label: 'Rechercher une section, une page ou une action',
    placeholder: 'Une section, une page, une action…',
    close: 'Fermer la recherche rapide',
    groups: { sections: 'Sections', pages: 'Pages', actions: 'Actions' },
    empty: (query) => `Aucun résultat pour « ${query} »`,
    count: (count) =>
      `${String(count)} ${PLURALS.fr.select(count) === 'one' ? 'résultat' : 'résultats'}`,
    actions: {
      themes: {
        light: { label: 'Thème clair', keywords: 'apparence couleurs jour' },
        dark: { label: 'Thème sombre', keywords: 'apparence couleurs nuit' },
        system: { label: 'Thème du système', keywords: 'apparence couleurs automatique' },
      },
      languageKeywords: 'langue anglais',
      downloadCv: { label: `Télécharger le CV (${CV_FILE.details.fr})`, keywords: 'curriculum' },
      email: { label: 'Écrire un e-mail à William', keywords: 'contact courriel message' },
      linkedin: { label: 'Ouvrir LinkedIn (nouvel onglet)', keywords: 'profil réseau' },
    },
  },
  en: {
    title: 'Quick search',
    label: 'Search for a section, a page or an action',
    placeholder: 'A section, a page, an action…',
    close: 'Close the quick search',
    groups: { sections: 'Sections', pages: 'Pages', actions: 'Actions' },
    empty: (query) => `No result for “${query}”`,
    count: (count) =>
      `${String(count)} ${PLURALS.en.select(count) === 'one' ? 'result' : 'results'}`,
    actions: {
      themes: {
        light: { label: 'Light theme', keywords: 'appearance colours day' },
        dark: { label: 'Dark theme', keywords: 'appearance colours night' },
        system: { label: 'System theme', keywords: 'appearance colours automatic' },
      },
      languageKeywords: 'language french',
      downloadCv: { label: `Download my CV (${CV_FILE.details.en})`, keywords: 'resume' },
      email: { label: 'Email William', keywords: 'contact mail message' },
      linkedin: { label: 'Open LinkedIn (new tab)', keywords: 'profile network' },
    },
  },
};

type CommandPaletteProps = {
  // Drawn by the host, in the main chunk: imported here, lucide's icons made the bundler
  // move React itself out of the main chunk (+1 kB of initial JavaScript, ADR 0034).
  icons: { search: ReactNode; close: ReactNode };
};

// The quick search (ADR 0034), opened by ⌘K / Ctrl+K or its header button: every section,
// page and action of the header and the footer, found by typing. A modal dialog in its own
// chunk, mounted only while open: a search field, then a list per group of real links and
// buttons, which the arrows move through.
export function CommandPalette({ icons }: CommandPaletteProps) {
  const messages = useLocalized(PALETTE_MESSAGES);
  const entries = usePaletteCommands(messages.actions);
  const { dialogRef, fieldRef } = usePaletteDialog();
  const {
    query,
    changeQuery,
    results,
    count,
    resultsRef,
    handleFieldKeyDown,
    handleResultKeyDown,
  } = usePaletteSearch(entries, fieldRef);
  const fieldId = useId();
  const groupIdPrefix = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-label={messages.title}
      onClose={closeCommandPalette}
      className="mx-auto mt-[12vh] mb-auto w-[min(36rem,calc(100%-2rem))] max-w-none overflow-hidden rounded-lg border border-border bg-surface p-0 text-fg shadow-overlay backdrop:bg-canvas/80"
    >
      <div className="relative flex items-center gap-3 border-b border-border ps-4 pe-2">
        {icons.search}
        <label htmlFor={fieldId} className="sr-only">
          {messages.label}
        </label>
        <input
          ref={fieldRef}
          id={fieldId}
          type="search"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder={messages.placeholder}
          value={query}
          onChange={(event) => {
            changeQuery(event.currentTarget.value);
          }}
          onKeyDown={handleFieldKeyDown}
          className="peer min-h-14 min-w-0 flex-1 bg-transparent text-fg placeholder:text-fg-muted focus-visible:outline-hidden [&::-webkit-search-cancel-button]:hidden"
        />
        {/* The field's focus, drawn under the whole row: an outline around the field would
            box it in. The transparent outline still shows in forced colours. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-0.75 bg-focus opacity-0 peer-focus-visible:opacity-100"
        />
        <button
          type="button"
          onClick={closeCommandPalette}
          className="inline-grid size-11 shrink-0 place-items-center rounded-md text-fg-muted transition-colors duration-150 hover:bg-surface-raised hover:text-fg"
        >
          {icons.close}
          <span className="sr-only">{messages.close}</span>
        </button>
      </div>

      <div ref={resultsRef} className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
        {results.map(({ group, entries: found }) => {
          const headingId = `${groupIdPrefix}${group}`;
          return (
            <div key={group}>
              <h2
                id={headingId}
                className="px-3 pt-3 pb-1 text-small font-semibold tracking-[0.2em] text-fg-muted uppercase"
              >
                {messages.groups[group]}
              </h2>
              <ul aria-labelledby={headingId}>
                {found.map((entry) => (
                  <li key={entry.id}>
                    <PaletteResult entry={entry} onKeyDown={handleResultKeyDown} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {count === 0 ? <p className="px-5 pb-5 text-fg-muted">{messages.empty(query)}</p> : null}
      {/* aria-live is implicit on <output>, but not every screen reader honours it. */}
      <output aria-live="polite" className="sr-only">
        {messages.count(count)}
      </output>
    </dialog>
  );
}

const RESULT_CLASS_NAME =
  'flex min-h-11 w-full items-center rounded-md px-3 text-start text-fg no-underline hover:bg-surface-raised focus-visible:bg-surface-raised';

type PaletteResultProps = {
  entry: PaletteEntry;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

// One result as the element it is: a link that goes somewhere, a router link to a page of
// the site, a button that acts. Following it closes the palette first.
function PaletteResult({ entry, onKeyDown }: PaletteResultProps) {
  switch (entry.kind) {
    case 'route': {
      return (
        <Link
          to={entry.path}
          data-palette-result
          onClick={closeCommandPalette}
          onKeyDown={onKeyDown}
          className={RESULT_CLASS_NAME}
        >
          {entry.label}
        </Link>
      );
    }
    case 'link': {
      return (
        <a
          href={entry.href}
          data-palette-result
          lang={entry.lang}
          hrefLang={entry.lang}
          download={entry.download === true ? '' : undefined}
          target={entry.newTab === true ? '_blank' : undefined}
          rel={entry.newTab === true ? 'noopener noreferrer' : undefined}
          onClick={(event) => {
            entry.onFollow?.(event.currentTarget);
            closeCommandPalette();
          }}
          onKeyDown={onKeyDown}
          className={RESULT_CLASS_NAME}
        >
          {entry.label}
        </a>
      );
    }
    case 'action': {
      return (
        <button
          type="button"
          data-palette-result
          onClick={() => {
            closeCommandPalette();
            entry.run();
          }}
          onKeyDown={onKeyDown}
          className={RESULT_CLASS_NAME}
        >
          {entry.label}
        </button>
      );
    }
  }
}
