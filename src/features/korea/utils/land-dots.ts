// The globe's continents are dots on a grid spread evenly over the sphere: rows of latitude
// `rowStep` degrees apart, each with as many dots as its circle holds at that spacing. A
// mask keeps one bit per dot: land or sea. scripts/generate-land-dots.ts writes the mask;
// the globe reads it back. The script runs this file under Node: it imports nothing.

type DotGridConfig = { rowStep: number; minLatitude: number; maxLatitude: number };

// A GeoPoint (types/geo-point.ts) in shape: Node runs this file and cannot resolve `@/`.
type GridDot = { latitude: number; longitude: number };

/** @internal Shared with scripts/generate-land-dots.ts, which lays the same grid. */
export function buildDotGrid({ rowStep, minLatitude, maxLatitude }: DotGridConfig): GridDot[] {
  const dots: GridDot[] = [];
  for (let latitude = minLatitude; latitude <= maxLatitude + 1e-9; latitude += rowStep) {
    const rowLatitude = Number(latitude.toFixed(6));
    const count = Math.max(
      1,
      Math.round((360 * Math.cos((rowLatitude * Math.PI) / 180)) / rowStep),
    );
    const step = 360 / count;
    for (let index = 0; index < count; index += 1) {
      dots.push({ latitude: rowLatitude, longitude: -180 + step / 2 + index * step });
    }
  }
  return dots;
}

// Eight dots per byte, then base64: the whole planet in a couple of kilobytes.
/** @internal Used by scripts/generate-land-dots.ts, which writes the mask. */
export function encodeLandMask(land: readonly boolean[]): string {
  const bytes = new Uint8Array(Math.ceil(land.length / 8));
  land.forEach((isLand, index) => {
    if (isLand) {
      bytes[index >> 3] = (bytes[index >> 3] ?? 0) | (1 << (index & 7));
    }
  });
  return btoa(String.fromCharCode(...bytes));
}

/** @internal Tested against the mask the script writes. */
export function decodeLandMask(mask: string, count: number): boolean[] {
  const bytes = Uint8Array.from(atob(mask), (character) => character.charCodeAt(0));
  return Array.from(
    { length: count },
    (_, index) => ((bytes[index >> 3] ?? 0) & (1 << (index & 7))) !== 0,
  );
}

// The land dots of a generated mask (data/land-dots.ts), as places.
export function landPoints({
  count,
  mask,
  ...grid
}: DotGridConfig & { count: number; mask: string }): GridDot[] {
  const land = decodeLandMask(mask, count);
  return buildDotGrid(grid).filter((_, index) => land[index] === true);
}
