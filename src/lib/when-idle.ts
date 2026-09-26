// Runs a callback once the page is idle, so what it starts never competes with the first
// paint or with hydration. Returns the cancellation.
export function whenIdle(callback: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => {
      window.cancelIdleCallback(handle);
    };
  }
  // Safari has no requestIdleCallback.
  const handle = setTimeout(callback, 300);
  return () => {
    clearTimeout(handle);
  };
}
