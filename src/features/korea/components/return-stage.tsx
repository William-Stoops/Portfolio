import { FlightScene } from '@/features/korea/components/flight-scene';
import { FrenchFlag } from '@/features/korea/components/french-flag';
import { type KoreaContent } from '@/features/korea/types/korea-content';

type ReturnStageProps = { content: KoreaContent };

// The way home, in the voyage's mirror: 안녕히 계세요 under Seoul, the flight west, the
// French flag unfurling band after band where the plane lands, then "Bonjour." rising
// under it (translated on the English page).
export function ReturnStage({ content }: ReturnStageProps) {
  const { farewell, greeting } = content.homecoming;

  return (
    <FlightScene
      direction="west"
      route={{ origin: content.route.destination, destination: content.route.origin }}
      timeline="--homecoming"
      flag={<FrenchFlag />}
      greeting={greeting}
      aside={
        <p className="flex flex-wrap items-baseline gap-x-3 font-display text-h3 font-semibold lg:justify-end">
          <span lang="ko" className="text-accent-fg">
            {farewell.korean}
          </span>
          <span className="font-medium text-fg-subtle">({farewell.translation})</span>
        </p>
      }
    />
  );
}
