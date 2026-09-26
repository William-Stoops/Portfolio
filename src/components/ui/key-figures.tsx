export type KeyFigure = { value: string; label: string };

type KeyFiguresProps = {
  // Names the list for assistive tech ("En bref", "STAXX en chiffres").
  label: string;
  figures: readonly KeyFigure[];
  // enter-slide on load (above the fold: no fade, see motion.css), reveal on scroll.
  entrance?: 'enter-slide' | 'reveal';
  // Stagger position of the first figure, to follow what precedes it.
  firstIndex?: number;
};

// A row of figures separated by thin rules: a strong value, a grey caption. Real text,
// read as "value label". Stacks on small screens.
export function KeyFigures({
  label,
  figures,
  entrance = 'enter-slide',
  firstIndex = 0,
}: KeyFiguresProps) {
  return (
    <ul
      aria-label={label}
      className="grid gap-5 border-t border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border"
    >
      {figures.map(({ value, label: caption }, index) => (
        <li
          key={value}
          style={{ '--i': firstIndex + index }}
          className={`${entrance} flex flex-col gap-1 sm:px-5 sm:first:ps-0 sm:last:pe-0`}
        >
          <span className="font-display text-lead font-semibold whitespace-nowrap text-fg">
            {value}
          </span>{' '}
          <span className="text-small text-fg-muted">{caption}</span>
        </li>
      ))}
    </ul>
  );
}
