import { KineticBand } from '@/components/ui/kinetic-band';
import { type AboutContent } from '@/features/about/types/about-content';

type AxisBandProps = { axes: AboutContent['axes'] };

// The three axes in giant type, between the profile and the timeline. Repeated so the
// lines never run out; the axes are listed just above.
export function AxisBand({ axes }: AxisBandProps) {
  const line = [...axes, ...axes].map(({ title }) => `${title} — `).join('');

  return <KineticBand lines={[{ text: line }, { text: line }]} />;
}
