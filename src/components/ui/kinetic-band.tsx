type KineticLine = { text: string; lang?: string };

type KineticBandProps = {
  // Two lines: the first in the text colour, drifting left; the second in filigree, one
  // step above the canvas in the accent's tint, drifting right.
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
      {/* A picture of the words, drawn by CSS (a pseudo-element), not text of the page,
          as the years in filigree are. Filled, never outlined: an outline of the variable
          font shows the overlapping contours of its glyphs. */}
      <p
        lang={second.lang}
        data-filigree={second.text}
        className={`drift-right text-accent-tint before:content-[attr(data-filigree)] ${LINE_CLASS_NAME}`}
      />
    </div>
  );
}
