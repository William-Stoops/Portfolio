import { describe, expect, it } from 'vitest';

import { isOnLand, landPolygons, parseTopology } from './land-mask.ts';

// An island from -10 to 10 in both axes, with a lake from -2 to 2. Quantized positions are
// multiplied by 0.1 and moved by -10; each arc stores its first point, then the deltas.
const TOPOLOGY = parseTopology(
  JSON.stringify({
    type: 'Topology',
    transform: { scale: [0.1, 0.1], translate: [-10, -10] },
    arcs: [
      [
        [0, 0],
        [200, 0],
        [0, 200],
        [-200, 0],
        [0, -200],
      ],
      [
        [80, 80],
        [0, 40],
        [40, 0],
        [0, -40],
        [-40, 0],
      ],
    ],
    objects: {
      land: {
        type: 'GeometryCollection',
        geometries: [{ type: 'MultiPolygon', arcs: [[[0], [1]]] }],
      },
    },
  }),
);

describe('landPolygons', () => {
  it('decodes quantized, delta-encoded arcs into rings of longitude and latitude', () => {
    const [[outer, lake] = []] = landPolygons(TOPOLOGY);

    expect(outer).toEqual([
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
      [-10, -10],
    ]);
    expect(lake?.[0]).toEqual([-2, -2]);
  });

  it('reads a negative arc index as that arc reversed', () => {
    const reversed = parseTopology(
      JSON.stringify({
        type: 'Topology',
        transform: { scale: [1, 1], translate: [0, 0] },
        arcs: [
          [
            [0, 0],
            [5, 0],
          ],
        ],
        objects: {
          land: {
            type: 'GeometryCollection',
            geometries: [{ type: 'MultiPolygon', arcs: [[[-1]]] }],
          },
        },
      }),
    );

    expect(landPolygons(reversed)[0]?.[0]).toEqual([
      [5, 0],
      [0, 0],
    ]);
  });
});

describe('isOnLand', () => {
  const polygons = landPolygons(TOPOLOGY);

  it('finds a point on the island', () => {
    expect(isOnLand(5, 5, polygons)).toBe(true);
  });

  it('leaves the lake and the sea around the island as water', () => {
    expect(isOnLand(0, 0, polygons)).toBe(false);
    expect(isOnLand(15, 0, polygons)).toBe(false);
  });
});

describe('parseTopology', () => {
  it('rejects a file that is not a quantized land topology', () => {
    expect(() => parseTopology('{"type": "Topology"}')).toThrow(/transform|arcs|objects/);
  });
});
