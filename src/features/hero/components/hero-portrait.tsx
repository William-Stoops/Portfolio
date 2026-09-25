import { ResponsiveImage } from '@/components/ui/responsive-image';
import { PORTRAIT_PICTURE } from '@/features/hero/data/portrait-picture';

type HeroPortraitProps = { alt: string };

// The accent ring frames the person (the one decorative motif of the design system).
export function HeroPortrait({ alt }: HeroPortraitProps) {
  return (
    <div className="mx-auto w-64 rounded-full border-4 border-accent p-3 sm:w-80 lg:w-96">
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
