import { ResponsiveImage } from '@/components/ui/responsive-image';
import { type KoreaContent } from '@/features/korea/types/korea-content';

type KoreaPhotoProps = {
  photo: KoreaContent['photos'][number];
  // Rendered width, for the browser to pick the file (see ResponsiveImage).
  sizes: string;
};

// A photo, always whole: framed at its own ratio and never cropped. Its frame opens up as
// it arrives; the caption pairs the Korean word with what the photo shows.
export function KoreaPhoto({ photo: { picture, alt, korean, caption }, sizes }: KoreaPhotoProps) {
  return (
    <figure className="flex flex-col gap-4">
      <div className="reveal-expand overflow-clip rounded-lg">
        <ResponsiveImage
          picture={picture}
          alt={alt}
          sizes={sizes}
          loading="lazy"
          className="block aspect-[3/4] w-full"
        />
      </div>
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span lang="ko" className="font-display text-h2 font-bold text-accent-fg">
          {korean}
        </span>
        <span className="text-fg-muted">{caption}</span>
      </figcaption>
    </figure>
  );
}
