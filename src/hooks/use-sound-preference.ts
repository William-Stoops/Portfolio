import { useSyncExternalStore } from 'react';

import { isSoundOn, setSoundOn, subscribeToSoundPreference } from '@/lib/sound-preference';

// Whether the visitor turned the site's sounds on (ADR 0035). The prerendered page cannot
// know it: it is built silent, and a stored choice applies once hydrated.
export function useSoundPreference(): {
  isSoundOn: boolean;
  setSoundOn: (on: boolean) => void;
} {
  const on = useSyncExternalStore(subscribeToSoundPreference, isSoundOn, () => false);
  return { isSoundOn: on, setSoundOn };
}
