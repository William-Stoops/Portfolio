type Box = { width: number; height: number; margin: number };
type Neuron = { layer: number; x: number; y: number };
type Edge = { x1: number; y1: number; x2: number; y2: number };

const round = (value: number): number => Math.round(value * 100) / 100;

// Where the neurons of a small fully connected network sit in a drawing, and the
// connections between each layer and the next: columns evenly spread from the input on the
// left to the output on the right, each column's neurons spread over the height and
// centred. The connections are grouped by the layer they leave, so the signal can cross
// them one layer after the other.
export function networkLayout(
  layerSizes: readonly number[],
  { width, height, margin }: Box,
): { nodes: readonly Neuron[]; edges: readonly (readonly Edge[])[] } {
  const widest = Math.max(...layerSizes);
  const gap = (height - 2 * margin) / (widest - 1);
  const columnGap = (width - 2 * margin) / (layerSizes.length - 1);
  const columns = layerSizes.map((size, layer) => {
    const top = height / 2 - ((size - 1) * gap) / 2;
    return Array.from({ length: size }, (_, index) => ({
      layer,
      x: round(margin + layer * columnGap),
      y: round(top + index * gap),
    }));
  });
  const edges = columns
    .slice(0, -1)
    .map((column, layer) =>
      column.flatMap((from) =>
        (columns[layer + 1] ?? []).map((to) => ({ x1: from.x, y1: from.y, x2: to.x, y2: to.y })),
      ),
    );
  return { nodes: columns.flat(), edges };
}
