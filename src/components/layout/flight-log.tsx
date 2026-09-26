import { Plane } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

import { splitIntoLetters } from '@/utils/split-text';
import { splitOdometer } from '@/utils/split-odometer';

type FlightLogStop = {
  id: string;
  year: number;
  label: string;
  title: string;
  content: ReactNode;
};

type FlightLogProps = { stops: readonly FlightLogStop[] };

// A journey told stop after stop along one flight path: the thread of the page.
//
// The rail is dotted like the flight to Seoul; behind a plane riding the reading line it
// turns into a solid trail. Each stop lights up as the plane reaches it: its marker fills,
// a branch draws out to it, its title rises letter by letter over its year set large in
// filigree. On large screens a sticky column rolls the year like an odometer. The plane
// steps off the rail while a flight scene flies its own (to Seoul, then home), and lands at the end of the
// path. All of it is scroll-driven CSS (motion.css) and drawing, hidden from assistive
// tech: each stop says its year and title in words, the ordered list tells the sequence,
// and without scroll-driven animations the stops simply follow each other.
export function FlightLog({ stops }: FlightLogProps) {
  const timelines = stops.map((_, index) => `--stop-${String(index)}`);
  const { fixed, rolling } = splitOdometer(stops.map(({ year }) => year));

  return (
    <div
      style={{
        '--scope': [...timelines, '--voyage', '--homecoming'].join(', '),
        // One roll per stop after the first, each on its stop's timeline (odometer-roll).
        '--roll-names': timelines
          .slice(1)
          .map(() => 'odometer-step')
          .join(', '),
        '--roll-timelines': timelines.slice(1).join(', '),
      }}
      className="relative rail-timeline flight-log-layout lg:ps-52"
    >
      <div
        data-flight-rail
        aria-hidden="true"
        className="absolute inset-y-0 start-[0.4375rem] w-0.5 lg:start-[13.4375rem]"
      >
        <div className="absolute inset-0 flight-path" />
        <div className="absolute inset-0 flight-log-fill rounded-full bg-accent" />
        {/* The landing: where the path ends, today. */}
        <span className="absolute -start-[0.6875rem] bottom-0 size-6 rounded-full border-2 border-accent bg-canvas">
          <span className="absolute inset-1 rounded-full bg-accent" />
        </span>
        {/* The plane rides the tip of the trail, on the reading line. */}
        <div className="absolute inset-0">
          <div
            style={{ '--away-timeline': '--voyage' }}
            className="sticky top-[40vh] -ms-[1.1875rem] size-10 -translate-y-1/2 flight-log-plane"
          >
            <div
              style={{ '--away-timeline': '--homecoming' }}
              className="relative size-full flight-log-plane"
            >
              <span className="absolute inset-1 rounded-full bg-canvas" />
              {/* The icon's nose points up and to the right: three eighths of a turn face down. */}
              <Plane
                strokeWidth={1.75}
                className="relative size-full rotate-135 p-1.5 text-accent-fg"
              />
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-y-0 start-0 chapter-rail w-44">
        <div data-odometer className="sticky top-32 flex flex-col gap-3">
          <p className="font-display text-[clamp(2.75rem,1.5rem+2vw,3.75rem)] leading-none font-bold whitespace-nowrap tabular-nums">
            <span data-odometer-fixed>{fixed}</span>
            <span className="inline-block h-[1lh] overflow-clip align-top text-accent-fg">
              <span className="flex flex-col odometer-roll">
                {rolling.map((digits) => (
                  <span key={digits} data-odometer-digit>
                    {digits}
                  </span>
                ))}
              </span>
            </span>
          </p>
          <div className="relative h-6">
            {stops.map(({ id, label }, index) => (
              <p
                key={id}
                style={{ '--timeline': timelines[index] }}
                className="absolute inset-x-0 top-0 stop-label-in text-small font-semibold tracking-[0.2em] text-fg-muted uppercase"
              >
                <span className="block stop-label-out">{label}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Contiguous stops (spaced by padding, not gaps): one is always under the reading line. */}
      <ol className="flex flex-col">
        {stops.map(({ id, year, label, title, content }, index) => (
          <li
            key={id}
            id={id}
            style={{ '--timeline': timelines[index] }}
            className="@container relative isolate flex flex-col gap-10 ps-10 pb-32 chapter-timeline md:ps-16"
          >
            <span
              data-stop-marker
              aria-hidden="true"
              className="absolute start-0 top-3 size-4 rounded-full border-2 border-accent bg-canvas"
            >
              <span className="absolute inset-0.5 stop-reached rounded-full bg-accent" />
            </span>
            <span
              aria-hidden="true"
              className="absolute start-4 top-[1.1875rem] hidden h-px w-8 stop-branch bg-accent md:block md:w-12"
            />
            <header className="relative flex flex-col gap-3">
              {/* The year in filigree behind the title, drifting slower than the page. Drawn by CSS
                  (a pseudo-element): a picture of the year, not text of the page. */}
              <span
                data-stop-year={String(year)}
                aria-hidden="true"
                className="absolute end-0 -top-10 -z-10 year-drift font-display text-[clamp(5rem,2rem+10vw,11rem)] leading-none font-bold text-surface-raised tabular-nums select-none before:content-[attr(data-stop-year)]"
              />
              {/* Shown large by the odometer on large screens: read here, seen there. */}
              <p className="chapter-heading reveal-slide text-small font-semibold tracking-[0.2em] text-accent-fg uppercase tabular-nums">
                {String(year)} · {label}
              </p>
              <h3 className="text-h1 font-semibold tracking-tight">
                <span className="sr-only">{title}</span>
                <span aria-hidden="true">
                  {splitIntoLetters(title).map(({ text, index: wordIndex, letters }) => (
                    <Fragment key={`${text}-${String(wordIndex)}`}>
                      {wordIndex > 0 ? ' ' : null}
                      <span className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]">
                        {letters.map((letter) => (
                          <span
                            key={letter.index}
                            style={{ '--i': letter.index }}
                            className="inline-block reveal-letter"
                          >
                            {letter.text}
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </h3>
            </header>
            <div className="flex flex-col gap-10 *:reveal-from-rail">{content}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
