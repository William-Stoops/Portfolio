import { describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useInlinePlayer } from '@/hooks/use-inline-player';

describe('useInlinePlayer', () => {
  it('waits for the visitor, then plays', async () => {
    const { result, act } = await renderHook(() => useInlinePlayer());
    expect(result.current.isPlaying).toBe(false);

    await act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });
});
