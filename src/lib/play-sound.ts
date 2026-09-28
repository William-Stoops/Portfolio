import { isSoundOn } from '@/lib/sound-preference';

// The site's few sounds (ADR 0035): a tap for a choice made, two notes for the quick
// search opening, the cabin chime when a flight ends (the race, the diverted flight).
export type SoundName = 'tap' | 'open' | 'chime';

async function playLoaded(name: SoundName): Promise<void> {
  try {
    const { play } = await import('@/lib/sound-engine');
    play(name);
  } catch (error) {
    // A synthesiser that cannot load (offline) costs a sound, never the page.
    if (!(error instanceof Error)) {
      throw error;
    }
  }
}

// Plays a sound if the visitor turned the sounds on, and only then loads the synthesiser,
// in its own chunk. Nothing before the visitor's first gesture on the page: the browser
// would hold the audio back and play it late, at the next click.
export function playSound(name: SoundName): void {
  if (isSoundOn() && navigator.userActivation.hasBeenActive) {
    void playLoaded(name);
  }
}
