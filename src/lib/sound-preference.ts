import * as z from 'zod/mini';

// The sounds are off until the visitor turns them on (ADR 0035), and the choice is kept
// for the next visits. Storage is the source of truth: another tab's choice applies here.
const SOUND_STORAGE_KEY = 'sound-preference';
const SOUND_CHANGE_EVENT = 'sound-preference-change';

// zod/mini: this runs on every page, where full Zod would cost ~10 kB brotli.
const soundPreferenceSchema = z.enum(['on']);

// Anything missing or unexpected (hand-edited storage, blocked storage) means off.
export function isSoundOn(): boolean {
  try {
    return soundPreferenceSchema.safeParse(localStorage.getItem(SOUND_STORAGE_KEY)).success;
  } catch (error) {
    if (error instanceof DOMException) {
      return false;
    }
    throw error;
  }
}

export function setSoundOn(on: boolean): void {
  try {
    if (on) {
      localStorage.setItem(SOUND_STORAGE_KEY, 'on');
    } else {
      localStorage.removeItem(SOUND_STORAGE_KEY);
    }
  } catch (error) {
    // Blocked storage: the sounds stay off, as without a choice.
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }
  window.dispatchEvent(new Event(SOUND_CHANGE_EVENT));
}

export function subscribeToSoundPreference(onChange: () => void): () => void {
  function handleStorage(event: StorageEvent): void {
    if (event.key === SOUND_STORAGE_KEY) {
      onChange();
    }
  }
  window.addEventListener(SOUND_CHANGE_EVENT, onChange);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(SOUND_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', handleStorage);
  };
}
