import { afterEach, describe, expect, it, vi } from 'vitest';

import { isSoundOn, setSoundOn, subscribeToSoundPreference } from '@/lib/sound-preference';

// Literal on purpose: a stored choice outlives the code that wrote it.
const SOUND_STORAGE_KEY = 'sound-preference';

afterEach(() => {
  localStorage.clear();
});

describe('sound preference', () => {
  it('keeps the sounds off until the visitor turns them on', () => {
    expect(isSoundOn()).toBe(false);
  });

  it('remembers the choice across visits, and forgets it once turned off again', () => {
    setSoundOn(true);
    expect(localStorage.getItem(SOUND_STORAGE_KEY)).toBe('on');
    expect(isSoundOn()).toBe(true);

    setSoundOn(false);
    expect(localStorage.getItem(SOUND_STORAGE_KEY)).toBeNull();
    expect(isSoundOn()).toBe(false);
  });

  it('reads anything unexpected in storage as off', () => {
    localStorage.setItem(SOUND_STORAGE_KEY, 'loud');

    expect(isSoundOn()).toBe(false);
  });

  it('tells its listeners of a change, made here or in another tab', () => {
    const onChange = vi.fn<() => void>();
    const stop = subscribeToSoundPreference(onChange);

    setSoundOn(true);
    window.dispatchEvent(new StorageEvent('storage', { key: SOUND_STORAGE_KEY, newValue: null }));
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'theme-preference', newValue: 'dark' }),
    );
    stop();
    setSoundOn(false);

    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
