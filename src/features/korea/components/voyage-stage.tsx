import { FlightScene } from '@/features/korea/components/flight-scene';
import { TaegeukFlag } from '@/features/korea/components/taegeuk-flag';
import { type KoreaContent } from '@/features/korea/types/korea-content';

type VoyageStageProps = { content: KoreaContent };

// The voyage to Seoul: the year in a sentence under France, the flight east, the Korean
// flag unfurling where the plane lands, then 안녕하세요.
export function VoyageStage({ content }: VoyageStageProps) {
  return (
    <FlightScene
      direction="east"
      route={content.route}
      timeline="--voyage"
      flag={<TaegeukFlag />}
      greeting={{
        text: content.greeting.korean,
        lang: 'ko',
        translation: content.greeting.french,
      }}
      aside={<p className="max-w-3xl text-lead text-fg-muted">{content.lead}</p>}
    />
  );
}
