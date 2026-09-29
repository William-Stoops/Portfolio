import { useId } from 'react';

import { PropagationDiagram } from '@/features/korea/components/propagation-diagram';
import { type KoreaCoursework } from '@/features/korea/types/korea-content';

type CourseworkBlockProps = { coursework: KoreaCoursework };

const CARD_CLASS_NAME = 'flex flex-col gap-5 rounded-lg border border-border bg-surface p-6';
const CARD_TITLE_CLASS_NAME = 'text-small font-semibold tracking-[0.2em] text-accent-fg uppercase';

// What the year at Korea University taught, before what was built there: the mathematics
// under deep learning, how a network learns, the architectures from the perceptron to the
// Transformer, and a network drawn with its two passes. On a wide enough chapter the first
// two cards sit side by side and the architectures run under them as a lineage, left to
// right; stacked otherwise.
export function CourseworkBlock({ coursework }: CourseworkBlockProps) {
  const titleId = useId();
  const { mathematics, learning, architectures } = coursework;

  return (
    <section aria-labelledby={titleId} className="@container flex flex-col gap-10">
      <header className="flex max-w-3xl flex-col gap-4">
        <h4 id={titleId} className="text-h2 font-semibold tracking-tight">
          {coursework.title}
        </h4>
        <p className="text-lead text-fg-muted">{coursework.lead}</p>
      </header>

      <PropagationDiagram propagation={coursework.propagation} />

      <div className="grid gap-4 @2xl:grid-cols-2">
        <article className={CARD_CLASS_NAME}>
          <h5 className={CARD_TITLE_CLASS_NAME}>{mathematics.title}</h5>
          <div className="flex flex-col gap-1">
            <p className="text-h3 font-semibold">{mathematics.course}</p>
            <p className="text-small text-fg-muted">{mathematics.source}</p>
          </div>
          <ul aria-label={mathematics.course} className="flex flex-col gap-2">
            {mathematics.topics.map((topic) => (
              <li key={topic} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                />
                {topic}
              </li>
            ))}
          </ul>
        </article>

        <article className={CARD_CLASS_NAME}>
          <h5 className={CARD_TITLE_CLASS_NAME}>{learning.title}</h5>
          <dl className="flex flex-col gap-4">
            {learning.topics.map(({ name, detail }) => (
              <div key={name} className="flex flex-col gap-1">
                <dt className="font-semibold">{name}</dt>
                <dd className="text-fg-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className={`${CARD_CLASS_NAME} @2xl:col-span-2`}>
          <h5 className={CARD_TITLE_CLASS_NAME}>{architectures.title}</h5>
          {/* A lineage: each architecture answers what the one before could not do. Down a
              line when stacked, along it when the card is wide. */}
          <ol
            aria-label={architectures.title}
            className="flex flex-col border-s border-border @2xl:mt-3 @2xl:grid @2xl:grid-cols-5 @2xl:border-s-0 @2xl:border-t @2xl:pt-5"
          >
            {architectures.lineage.map(({ name, role }) => (
              <li
                key={name}
                className="relative flex flex-col gap-0.5 ps-5 pb-4 last:pb-0 @2xl:ps-0 @2xl:pe-4 @2xl:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute -start-1 top-2 size-2 rounded-full bg-accent @2xl:start-0 @2xl:-top-6"
                />
                <strong className="font-semibold">{name}</strong>
                <span className="text-fg-muted">{role}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
