import { type ResponsivePicture } from '@/types/responsive-picture';
import { buildImageUrl, buildSrcSet, toImageMimeType } from '@/utils/responsive-picture';

type ResponsiveImageProps = {
  picture: ResponsivePicture;
  alt: string;
  // Must describe the rendered width at each breakpoint, or phones download desktop files.
  sizes: string;
  // "critical": the LCP image (eager, high fetch priority). "lazy": everything else.
  loading: 'critical' | 'lazy';
  className?: string;
};

export function ResponsiveImage({ picture, alt, sizes, loading, className }: ResponsiveImageProps) {
  const fallbackFormat = picture.formats.at(-1) ?? 'jpg';
  const modernFormats = picture.formats.slice(0, -1);
  const largestWidth = Math.max(...picture.widths);

  return (
    <picture>
      {modernFormats.map((format) => (
        <source
          key={format}
          type={toImageMimeType(format)}
          srcSet={buildSrcSet(picture, format)}
          sizes={sizes}
        />
      ))}
      <img
        src={buildImageUrl(picture, largestWidth, fallbackFormat)}
        srcSet={buildSrcSet(picture, fallbackFormat)}
        sizes={sizes}
        alt={alt}
        width={picture.width}
        height={picture.height}
        loading={loading === 'critical' ? 'eager' : 'lazy'}
        fetchPriority={loading === 'critical' ? 'high' : 'auto'}
        decoding={loading === 'critical' ? 'auto' : 'async'}
        className={className}
      />
    </picture>
  );
}
