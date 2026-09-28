// Runs a callback once, when an element comes within `margin` of the viewport: what it
// starts (a scene far down the page) is loaded only if the visitor goes there, and ready
// when it appears. Returns the cancellation.
export function whenNear(element: Element, callback: () => void, margin: string): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting === true) {
        observer.disconnect();
        callback();
      }
    },
    { rootMargin: margin },
  );
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
}
