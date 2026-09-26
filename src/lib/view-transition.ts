export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// A transition interrupted by the next one, or started in a hidden tab, rejects its
// `ready` promise: expected, the change still happens. Anything else is a real error.
export async function settleViewTransition(
  transition: Pick<ViewTransition, 'ready'>,
): Promise<void> {
  try {
    await transition.ready;
  } catch (error) {
    const isExpected =
      error instanceof DOMException &&
      (error.name === 'AbortError' || error.name === 'InvalidStateError');
    if (!isExpected) {
      throw error;
    }
  }
}

// The type lets motion.css style this transition alone (:active-view-transition-type()),
// apart from the theme switch. Without typed view transitions, or with reduced motion,
// the change simply happens.
export function runViewTransition(type: string, update: () => Promise<void>): void {
  if (
    !('startViewTransition' in document) ||
    !('ViewTransitionTypeSet' in window) ||
    prefersReducedMotion()
  ) {
    void update();
    return;
  }
  void settleViewTransition(document.startViewTransition({ update, types: [type] }));
}
