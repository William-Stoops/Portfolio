import { useVitalReadouts } from '@/features/behind-the-scenes/hooks/use-vital-readouts';
import { type VitalsContent } from '@/features/behind-the-scenes/types/behind-the-scenes-content';

type LiveVitalsProps = { content: VitalsContent };

// The measures of this visit as the visitor's own browser takes them, one tile each: its
// value large, the CI's threshold under it when there is one. Prerendered, before any
// browser has measured anything, each tile says its measure is on its way.
export function LiveVitals({ content }: LiveVitalsProps) {
  const readouts = useVitalReadouts(content);

  return (
    <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
      {readouts.map(({ key, label, value, threshold }) => (
        <div key={key} className="flex flex-col gap-1 bg-surface p-5 sm:last:col-span-2">
          <dt className="text-small font-semibold text-fg-muted">{label}</dt>
          <dd className="font-display text-h3 font-semibold text-fg tabular-nums">{value}</dd>
          {threshold === undefined ? null : (
            <dd className="text-small text-fg-muted">{threshold}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
