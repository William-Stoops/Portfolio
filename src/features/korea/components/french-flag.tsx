// The flag of France, three equal bands, blue at the hoist. It unfurls band after band as
// the plane comes home (motion.css, band-unfurl). Decoration: the stop says France.
const BANDS = [
  { colour: 'bg-tricolore-blue' },
  { colour: 'bg-flag-field' },
  { colour: 'bg-tricolore-red' },
] as const;

export function FrenchFlag() {
  return (
    <div data-flag="france" aria-hidden="true" className="relative aspect-[3/2]">
      {/* The destination, outlined while the plane is on its way; the bands cover it. */}
      <div className="absolute inset-0 rounded-md border border-dashed border-border-input" />
      <div className="absolute inset-0 grid grid-cols-3 overflow-clip rounded-md border border-border">
        {BANDS.map(({ colour }, index) => (
          <span
            key={colour}
            data-band
            style={{ '--i': index }}
            className={`band-unfurl ${colour}`}
          />
        ))}
      </div>
    </div>
  );
}
