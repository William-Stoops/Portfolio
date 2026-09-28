import { useEffect } from 'react';

import { playSound, type SoundName } from '@/lib/play-sound';

// A sound as the page arrives: heard when the visitor turned the sounds on and has already
// touched the site in this visit (a page reached by a link inside it), never on a first
// load, which the browser keeps silent.
export function useSoundOnArrival(name: SoundName): void {
  useEffect(() => {
    playSound(name);
  }, [name]);
}
