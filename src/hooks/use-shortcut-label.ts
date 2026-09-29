import { useSyncExternalStore } from 'react';

const APPLE_PLATFORMS = /Macintosh|iPhone|iPad/;

function subscribe(): () => void {
  return unsubscribe;
}

function unsubscribe(): void {
  // The platform never changes during a visit: there is nothing to listen to.
}

// The quick search's shortcut as this visitor's keyboard writes it. The prerendered page
// cannot know the platform: it says Ctrl K, and a Mac says ⌘K once hydrated.
export function useShortcutLabel(): string {
  const isApple = useSyncExternalStore(
    subscribe,
    () => APPLE_PLATFORMS.test(navigator.userAgent),
    () => false,
  );
  return isApple ? '⌘K' : 'Ctrl K';
}
