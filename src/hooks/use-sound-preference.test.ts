import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useSoundPreference } from '@/hooks/use-sound-preference';

afterEach(() => {
  localStorage.clear();
});

describe('useSoundPreference', () => {
  it('starts silent, and follows the visitor’s choice', async () => {
    const { result, act } = await renderHook(() => useSoundPreference());
    expect(result.current.isSoundOn).toBe(false);

    await act(() => {
      result.current.setSoundOn(true);
    });

    expect(result.current.isSoundOn).toBe(true);
  });
});
