import { DestinationBoard } from '@/components/layout/destination-board';
import { PageMetadata } from '@/components/layout/page-metadata';
import { HoldingPattern } from '@/components/ui/holding-pattern';
import { DETOURS } from '@/config/navigation';
import { usePageHeading } from '@/hooks/use-page-heading';
import { useLocale, useLocalized } from '@/i18n/locale-context';
import { type Localized } from '@/i18n/locales';
import { formatPageTitle } from '@/utils/format-page-title';

type NotFoundMessages = {
  // Said to assistive tech; the board shows its own line, in capitals, for the eyes.
  flight: { spoken: string; board: string };
  title: string;
  message: string;
  holding: string;
  destinations: string;
};

const NOT_FOUND_MESSAGES: Localized<NotFoundMessages> = {
  fr: {
    flight: { spoken: 'Vol 404, dérouté', board: 'VOL 404 · DÉROUTÉ' },
    title: 'Page introuvable',
    message: 'L’adresse demandée ne correspond à aucune page de ce site.',
    holding: 'L’avion tourne en attente : choisissez une autre destination.',
    destinations: 'Autres destinations',
  },
  en: {
    flight: { spoken: 'Flight 404, diverted', board: 'FLIGHT 404 · DIVERTED' },
    title: 'Page not found',
    message: 'The address you asked for matches no page on this site.',
    holding: 'The plane is holding: pick another destination.',
    destinations: 'Other destinations',
  },
};

// The journey's plane has lost its way: flight 404, diverted, turns in on the board, and
// the plane holds over it while the visitor picks another destination.
export function NotFoundRoute() {
  const headingRef = usePageHeading();
  const locale = useLocale();
  const messages = useLocalized(NOT_FOUND_MESSAGES);

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-x-16 gap-y-12 px-gutter py-section lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <PageMetadata title={formatPageTitle(messages.title)} />
      <div className="flex max-w-prose flex-col gap-5">
        <p className="text-small font-semibold tracking-[0.2em] text-accent-fg">
          <span className="sr-only">{messages.flight.spoken}</span>
          <span aria-hidden="true">{messages.flight.board}</span>
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-h1 font-semibold focus-visible:outline-hidden"
        >
          {messages.title}
        </h1>
        <p className="text-lead text-fg-muted">{messages.message}</p>
        <p className="text-fg-muted">{messages.holding}</p>
        <div className="mt-4">
          <DestinationBoard title={messages.destinations} destinations={DETOURS[locale]} />
        </div>
      </div>
      {/* First on a phone, where the page is one column: the plane circles in view, above
          the words that say the same (it is decoration, so the reading order is theirs). */}
      <HoldingPattern className="-order-1 max-w-56 sm:max-w-xs lg:order-none lg:max-w-sm">
        <p className="font-display text-[clamp(3.5rem,2rem+6vw,6rem)] leading-none font-bold text-accent-fg tabular-nums">
          <span aria-hidden="true">404</span>
        </p>
      </HoldingPattern>
    </div>
  );
}
