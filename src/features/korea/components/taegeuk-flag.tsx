import { TAEGEUK_ROTATION, TRIGRAMS } from '@/features/korea/utils/taegeuk-geometry';

// The flag of South Korea, to its official construction (taegeuk-geometry.ts), assembled
// as it arrives: the field unfurls from the hoist, the taegeuk turns once and settles in
// its exact orientation, the four trigrams come in from their corners. Each piece is its
// own element, so all of it runs on the compositor. Decoration: the section says Korea.
export function TaegeukFlag() {
  return (
    <div data-flag aria-hidden="true" className="relative aspect-[3/2]">
      {/* The destination, outlined while the plane is on its way; the field covers it. */}
      <div className="absolute inset-0 rounded-md border border-dashed border-border-input" />
      <div className="absolute inset-0 voyage-unfurl rounded-md border border-border bg-flag-field" />
      <svg viewBox="-12 -12 24 24" className="absolute top-1/4 left-1/3 h-1/2 w-1/3 voyage-turn">
        <g transform={TAEGEUK_ROTATION}>
          <circle r={12} className="fill-taegeuk-red" />
          <path
            d="M0-12A6 6 0 0 0 0 0A6 6 0 0 1 0 12A12 12 0 0 1 0-12Z"
            className="fill-taegeuk-blue"
          />
        </g>
      </svg>
      {TRIGRAMS.map(({ name, path, left, top, rotate, from }, index) => (
        <svg
          key={name}
          viewBox="-6 -4 12 8"
          style={{ left, top, rotate, '--from': from, '--i': index }}
          className="absolute h-1/6 w-1/6 voyage-trigram"
        >
          <path d={path} strokeWidth={2} className="stroke-taegeuk-ink" />
        </svg>
      ))}
    </div>
  );
}
