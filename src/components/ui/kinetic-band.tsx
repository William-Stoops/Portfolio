type KineticLine = { text: string; lang?: string };

type KineticBandProps = {
  // Two lines: the first filled, drifting left; the second in outline, drifting right.
  lines: readonly [KineticLine, KineticLine];
};

const LINE_CLASS_NAME =
  'font-display text-[clamp(3rem,1rem+8vw,9rem)] leading-[1.05] font-bold tracking-tighter whitespace-nowrap';

// Giant type sliding sideways in opposite directions while the page scrolls (scroll-driven,
// compositor only): a break in rhythm between two sections. Decoration, hidden from
// assistive tech: what it says is said in the sections themselves. A line in another
// language keeps its `lang`, so the browser picks a font that has its glyphs.
export function KineticBand({ lines: [first, second] }: KineticBandProps) {
  return (
    <div aria-hidden="true" className="overflow-x-clip py-16 defer-render select-none">
      <p lang={first.lang} className={`drift-left text-fg ${LINE_CLASS_NAME}`}>
        {first.text}
      </p>
      <p
        lang={second.lang}
        className={`drift-right text-accent-fg [-webkit-text-fill-color:transparent] [-webkit-text-stroke-width:2px] ${LINE_CLASS_NAME}`}
      >
        {second.text}
      </p>
    </div>
  );
}
