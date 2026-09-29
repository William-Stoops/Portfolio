import { type RefObject, useEffect, useRef, useState } from 'react';

// A video played where it stands: nothing loads until the visitor asks, then the player
// takes the poster's place and the focus, which the play button, now gone, has left.
export function useInlinePlayer(): {
  isPlaying: boolean;
  play: () => void;
  playerRef: RefObject<HTMLIFrameElement | null>;
} {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isPlaying) {
      playerRef.current?.focus();
    }
  }, [isPlaying]);

  return {
    isPlaying,
    play: () => {
      setIsPlaying(true);
    },
    playerRef,
  };
}
