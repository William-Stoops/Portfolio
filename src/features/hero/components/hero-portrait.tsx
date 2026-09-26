import { ResponsiveImage } from '@/components/ui/responsive-image';
import { PORTRAIT_PICTURE } from '@/features/hero/data/portrait-picture';

type HeroPortraitProps = { alt: string };

// The accent ring frames the person and zooms in once; the portrait tilts towards a
// precise pointer. Nothing else on it: the surface behind carries the hero's depth.
export function HeroPortrait({ alt }: HeroPortraitProps) {
  return (
    <div
      data-pointer
      className="relative mx-auto w-64 pointer-tilt rounded-full p-3 sm:w-80 lg:w-96"
    >
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
  );
}
