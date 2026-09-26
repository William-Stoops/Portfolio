import { type AboutContent } from '@/features/about/types/about-content';

type AxisBandProps = { axes: AboutContent['axes'] };

const LINE_CLASS_NAME =
  'font-display text-[clamp(3rem,1rem+8vw,9rem)] leading-[1.05] font-bold tracking-tighter whitespace-nowrap';

// The three axes in giant type, two lines drifting in opposite directions while the page
// scrolls (scroll-driven, compositor only): a break in rhythm between the profile and the
// timeline. Repeated so the lines never run out; decoration, hidden from assistive tech,
// since the axes are listed just above.
export function AxisBand({ axes }: AxisBandProps) {
  const line = [...axes, ...axes].map(({ title }) => `${title} — `).join('');

  return (
    <div aria-hidden="true" className="overflow-x-clip py-16 select-none">
      <p className={`drift-left text-fg ${LINE_CLASS_NAME}`}>{line}</p>
      <p
        className={`drift-right text-accent-fg [-webkit-text-fill-color:transparent] [-webkit-text-stroke-width:2px] ${LINE_CLASS_NAME}`}
      >
        {line}
      </p>
    </div>
  );
}
