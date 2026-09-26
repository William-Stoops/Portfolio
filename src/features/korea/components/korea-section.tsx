import { KeyFigures } from '@/components/ui/key-figures';
import { PageSection } from '@/components/layout/page-section';
import { SECTION_IDS } from '@/config/paths';
import { KoreaPhoto } from '@/features/korea/components/korea-photo';
import { VoyageStage } from '@/features/korea/components/voyage-stage';
import { type KoreaContent } from '@/features/korea/types/korea-content';
import { splitIntoLetters } from '@/utils/split-text';

type KoreaSectionProps = { content: KoreaContent };

const OVERLINE_CLASS_NAME = 'text-small font-semibold tracking-[0.2em] uppercase';

// The year in Seoul in two movements: the voyage (the flight, the flag, the greeting),
// then the university and what was built there, with the photos set where they tell
// something: the stadium in the university's colours beside its name, the café where the
// code was written beside the models. Korean words carry `lang="ko"`, for screen readers
// and for the browser to pick a font that has their glyphs.
export function KoreaSection({ content }: KoreaSectionProps) {
  const [stadium, cafe, night] = content.photos;

  return (
    <PageSection id={SECTION_IDS.korea} title="Corée du Sud">
      <div className="@container flex flex-col gap-24">
        <VoyageStage content={content} />

        <div className="grid gap-14 @4xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] @4xl:items-center @4xl:gap-16">
          <div className="flex flex-col gap-6">
            <p className={`${OVERLINE_CLASS_NAME} reveal-slide text-accent-fg`}>
              {/* Hangul is never letter-spaced: its syllables are already set as blocks. */}
              <span lang="ko" className="tracking-normal">
                {content.route.to.korean}
              </span>{' '}
              · {content.route.to.french}
            </p>
            {/* The name in Hangul, letters rising: read once, in Latin letters, just below. */}
            <p
              aria-hidden="true"
              lang="ko"
              className="font-display text-[clamp(3.5rem,1rem+8vw,8rem)] leading-none font-bold"
            >
              {splitIntoLetters(content.university.korean).map(({ letters }) =>
                letters.map((letter) => (
                  <span
                    key={letter.index}
                    className="-mb-[0.15em] inline-block overflow-clip pb-[0.15em]"
                  >
                    <span style={{ '--i': letter.index }} className="inline-block reveal-letter">
                      {letter.text}
                    </span>
                  </span>
                )),
              )}
            </p>
            <p className="reveal-slide font-display text-h2 font-semibold">
              {content.university.name}
            </p>
            <KeyFigures label="L’année en chiffres" figures={content.figures} entrance="reveal" />
          </div>
          {stadium === undefined ? null : (
            <KoreaPhoto
              photo={stadium}
              sizes="(min-width: 72rem) 27rem, (min-width: 64rem) 38vw, 92vw"
            />
          )}
        </div>

        <div className="grid gap-14 @4xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] @4xl:gap-16">
          <div className="flex flex-col gap-6 @4xl:order-last @4xl:pt-2">
            <p className={`${OVERLINE_CLASS_NAME} text-fg-subtle`}>Ce que j’y ai entraîné</p>
            <ul aria-label="Modèles entraînés à Korea University" className="flex flex-col">
              {content.models.map(({ name, detail }, index) => (
                <li
                  key={name}
                  style={{ '--i': index }}
                  className="flex reveal-slide flex-col gap-2 py-6"
                >
                  <span aria-hidden="true" className="mb-4 block border-t border-border">
                    <span className="-mt-px block h-0.5 w-12 reveal-grow-x bg-accent" />
                  </span>
                  <h3 className="text-h3 font-semibold">{name}</h3>
                  <p className="text-fg-muted">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* The pair set apart in depth: the second photo rises faster than the page. */}
          <div className="grid gap-10 @2xl:grid-cols-2 @2xl:items-start @2xl:gap-6">
            {cafe === undefined ? null : (
              <KoreaPhoto
                photo={cafe}
                sizes="(min-width: 72rem) 19rem, (min-width: 40rem) 45vw, 92vw"
              />
            )}
            {night === undefined ? null : (
              <div className="@2xl:mt-24 @2xl:scroll-float">
                <KoreaPhoto
                  photo={night}
                  sizes="(min-width: 72rem) 19rem, (min-width: 40rem) 45vw, 92vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageSection>
  );
}
