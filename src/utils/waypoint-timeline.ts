// The view timeline of a stop or a section along the flight path, named after its anchor:
// the element declares it, the path's labels and markers follow it.
export function waypointTimeline(id: string): `--${string}` {
  return `--wp-${id}`;
}
