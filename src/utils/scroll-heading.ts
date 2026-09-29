type ScrollHeading = 'down' | 'up';

export type HeadingState = {
  heading: ScrollHeading;
  // Where the reader went farthest in that heading: the lowest point going down, the
  // highest going up.
  farthest: number;
};

// How far a reader goes against their heading before it turns: a shorter step back (a
// bounce, a hesitation) keeps the planes facing the way they were.
const TURN_DISTANCE = 32;

// The reader's heading after a scroll to `scrollY`.
export function nextScrollHeading(state: HeadingState, scrollY: number): HeadingState {
  if (state.heading === 'down') {
    return scrollY < state.farthest - TURN_DISTANCE
      ? { heading: 'up', farthest: scrollY }
      : { heading: 'down', farthest: Math.max(state.farthest, scrollY) };
  }
  return scrollY > state.farthest + TURN_DISTANCE
    ? { heading: 'down', farthest: scrollY }
    : { heading: 'up', farthest: Math.min(state.farthest, scrollY) };
}
