// Viridis (van der Walt and Smith, matplotlib): the colour scale of the lab's data, read in
// order by everyone, colour-blind or in greyscale alike. Data colours, not the palette's:
// they live inside the chart only (ADR 0036).
const VIRIDIS_STOPS = [
  '#440154',
  '#46327e',
  '#365c8d',
  '#277f8e',
  '#1fa187',
  '#4ac16d',
  '#a0da39',
  '#fde725',
] as const;

type Rgb = readonly [number, number, number];

const VIRIDIS_RGB: readonly Rgb[] = VIRIDIS_STOPS.map((hex) => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
]);

// The legend's bar: the same scale as the surface.
export const VIRIDIS_GRADIENT = `linear-gradient(90deg, ${VIRIDIS_STOPS.join(', ')})`;

// The colour of a level between 0 and 1, interpolated between the scale's stops.
export function viridis(level: number): Rgb {
  const position = Math.min(1, Math.max(0, level)) * (VIRIDIS_RGB.length - 1);
  const index = Math.min(VIRIDIS_RGB.length - 2, Math.floor(position));
  const fraction = position - index;
  const [r0, g0, b0] = VIRIDIS_RGB[index] ?? [0, 0, 0];
  const [r1, g1, b1] = VIRIDIS_RGB[index + 1] ?? [0, 0, 0];
  return [r0 + (r1 - r0) * fraction, g0 + (g1 - g0) * fraction, b0 + (b1 - b0) * fraction];
}
