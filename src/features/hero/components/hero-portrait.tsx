import { ResponsiveImage } from '@/components/ui/responsive-image';
import { PORTRAIT_PICTURE } from '@/features/hero/data/portrait-picture';

type HeroPortraitProps = { alt: string; stickers: readonly string[] };

// Where each sticker sits around the ring, and its colour: the first one carries the
// accent, the others stay quiet so the accent keeps its weight.
const STICKER_CLASS_NAMES = [
  '-top-2 -left-4 -rotate-6 bg-accent text-on-accent sm:-left-10',
  'top-1/2 -right-2 rotate-3 border border-border bg-surface text-fg sm:-right-12',
  '-bottom-2 left-2 -rotate-2 border border-border bg-surface-raised text-fg',
] as const;

// The accent ring frames the person and zooms in once; a dot grid gives depth behind
// it; the portrait tilts towards a precise pointer. The stickers repeat facts told
// elsewhere on the page: they are decoration, hidden from assistive tech.
export function HeroPortrait({ alt, stickers }: HeroPortraitProps) {
  return (
    <div className="relative isolate mx-auto w-64 sm:w-80 lg:w-96">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 dot-grid sm:-inset-16"
      />
      <div data-pointer className="relative pointer-tilt rounded-full p-3">
        <div
          aria-hidden="true"
          className="absolute inset-0 enter-zoom rounded-full border-4 border-accent"
        />
        <ResponsiveImage
          picture={PORTRAIT_PICTURE}
          alt={alt}
          sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 20rem, 16rem"
          loading="critical"
          className="aspect-square size-full rounded-full object-cover"
        />
      </div>
      <ul aria-hidden="true">
        {stickers.map((sticker, index) => (
          <li
            key={sticker}
            style={{ '--i': index }}
            className={`absolute enter-pop rounded-md px-3 py-1.5 font-display text-small font-semibold whitespace-nowrap shadow-overlay transition-[scale] duration-250 ease-out hover:scale-110 ${STICKER_CLASS_NAMES[index % STICKER_CLASS_NAMES.length] ?? ''}`}
          >
            {sticker}
          </li>
        ))}
      </ul>
    </div>
  );
}
