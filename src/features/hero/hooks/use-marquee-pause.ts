import { useState } from 'react';

// The technology band scrolls forever: WCAG 2.2.2 requires a way to stop it.
export function useMarqueePause(): { isPaused: boolean; togglePause: () => void } {
  const [isPaused, setIsPaused] = useState(false);

  function togglePause(): void {
    setIsPaused((wasPaused) => !wasPaused);
  }

  return { isPaused, togglePause };
}
