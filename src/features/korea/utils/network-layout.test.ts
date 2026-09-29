import { describe, expect, it } from 'vitest';

import { networkLayout } from '@/features/korea/utils/network-layout';

const LAYOUT = networkLayout([3, 5, 5, 2], { width: 640, height: 240, margin: 30 });

describe('networkLayout', () => {
  it('sets each layer in its column, from the input on the left to the output on the right', () => {
    const columns = LAYOUT.nodes.map(({ layer, x }) => ({ layer, x }));
    const xOfLayer = (layer: number): number[] => [
      ...new Set(columns.filter((node) => node.layer === layer).map(({ x }) => x)),
    ];

    expect([0, 1, 2, 3].map((layer) => xOfLayer(layer))).toEqual([[30], [223.33], [416.67], [610]]);
  });

  it('spreads each layer’s neurons evenly, centred on the height', () => {
    const output = LAYOUT.nodes.filter(({ layer }) => layer === 3).map(({ y }) => y);
    const wide = LAYOUT.nodes.filter(({ layer }) => layer === 1).map(({ y }) => y);

    expect((output[0] ?? 0) + (output[1] ?? 0)).toBeCloseTo(240);
    expect(wide).toEqual([30, 75, 120, 165, 210]);
  });

  it('connects every neuron to every neuron of the next layer, grouped by layer', () => {
    expect(LAYOUT.edges.map((edges) => edges.length)).toEqual([15, 25, 10]);
    const [first] = LAYOUT.edges[0] ?? [];
    expect(first).toEqual({ x1: 30, y1: 75, x2: 223.33, y2: 30 });
  });
});
