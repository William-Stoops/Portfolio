import { KineticBand } from '@/components/ui/kinetic-band';
import { type KoreaContent } from '@/features/korea/types/korea-content';

type KoreaBandProps = { band: KoreaContent['band'] };

// Repeated so the lines never run out.
function repeatLine(words: readonly string[]): string {
  return [...words, ...words].map((word) => `${word} — `).join('');
}

// Opens the Korea section: the words in Korean drifting one way, their translation the
// other.
export function KoreaBand({ band }: KoreaBandProps) {
  return (
    <KineticBand
      lines={[
        { text: repeatLine(band.korean), lang: 'ko' },
        { text: repeatLine(band.translation) },
      ]}
    />
  );
}
