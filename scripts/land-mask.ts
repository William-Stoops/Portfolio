import * as z from 'zod/mini';

type Position = readonly [number, number];
type Ring = readonly Position[];
// An outer ring, then its holes (lakes, inland seas).
type Polygon = readonly Ring[];

const positionSchema = z.tuple([z.number(), z.number()]);

// The part of a TopoJSON file (world-atlas) this script reads: quantized arcs, and the
// land as polygons of arc indexes.
const topologySchema = z.object({
  transform: z.object({ scale: positionSchema, translate: positionSchema }),
  arcs: z.array(z.array(positionSchema)),
  objects: z.object({
    land: z.object({
      geometries: z.array(
        z.union([
          z.object({ type: z.literal('Polygon'), arcs: z.array(z.array(z.number())) }),
          z.object({
            type: z.literal('MultiPolygon'),
            arcs: z.array(z.array(z.array(z.number()))),
          }),
        ]),
      ),
    }),
  }),
});

type Topology = z.infer<typeof topologySchema>;

export function parseTopology(json: string): Topology {
  return topologySchema.parse(JSON.parse(json));
}

// Each arc's first point is absolute, the next ones are deltas; all are quantized.
function decodeArcs({ arcs, transform }: Topology): Position[][] {
  const [scaleX, scaleY] = transform.scale;
  const [translateX, translateY] = transform.translate;
  return arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scaleX + translateX, y * scaleY + translateY] as const;
    });
  });
}

// A ring is its arcs joined end to end; `~i` (a negative index) is arc i reversed. Arcs
// share their end points: each one after the first drops its first point.
function ringOf(arcIndexes: readonly number[], arcs: readonly Position[][]): Ring {
  return arcIndexes.flatMap((arcIndex, position) => {
    const arc = arcIndex >= 0 ? (arcs[arcIndex] ?? []) : (arcs[-arcIndex - 1] ?? []).toReversed();
    return position === 0 ? arc : arc.slice(1);
  });
}

export function landPolygons(topology: Topology): Polygon[] {
  const arcs = decodeArcs(topology);
  return topology.objects.land.geometries.flatMap((geometry) =>
    (geometry.type === 'Polygon' ? [geometry.arcs] : geometry.arcs).map((polygon) =>
      polygon.map((ring) => ringOf(ring, arcs)),
    ),
  );
}

// Even-odd ray casting, in longitude and latitude: Natural Earth splits its polygons at
// the antimeridian, so no ring wraps around it.
function crossings(longitude: number, latitude: number, ring: Ring): number {
  let count = 0;
  for (
    let index = 0, previous = ring.length - 1;
    index < ring.length;
    previous = index, index += 1
  ) {
    const [x1, y1] = ring[index] ?? [0, 0];
    const [x2, y2] = ring[previous] ?? [0, 0];
    if (
      y1 > latitude !== y2 > latitude &&
      longitude < ((x2 - x1) * (latitude - y1)) / (y2 - y1) + x1
    ) {
      count += 1;
    }
  }
  return count;
}

export function isOnLand(
  longitude: number,
  latitude: number,
  polygons: readonly Polygon[],
): boolean {
  return polygons.some(
    (polygon) =>
      polygon.reduce((total, ring) => total + crossings(longitude, latitude, ring), 0) % 2 === 1,
  );
}
