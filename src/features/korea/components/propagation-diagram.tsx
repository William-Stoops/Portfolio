import { type KoreaCoursework } from '@/features/korea/types/korea-content';
import { networkLayout } from '@/features/korea/utils/network-layout';

type PropagationDiagramProps = { propagation: KoreaCoursework['propagation'] };

// A small fully connected network: three inputs, two hidden layers, two outputs.
const LAYERS = [3, 5, 5, 2] as const;
const BOX = { width: 640, height: 240, margin: 30 };
const NETWORK = networkLayout(LAYERS, BOX);
// Where, in the drawing's crossing of the screen (percent), each layer's connections
// light up: the way forward first, then the way back, from the output to the input.
const FORWARD_START = 12;
const BACKWARD_START = 50;
const STEP = 10;
// The line sample sits on the first line of its words when they wrap.
const LEGEND_ROW_CLASS_NAME = 'flex items-start gap-3';

// A network's two passes, drawn: as the drawing crosses the screen, the signal lights its
// connections layer by layer to the output (the accent), then the error flows back to the
// input (dashed). Scroll-driven, so it never moves on its own; still, both passes are
// drawn. Decoration: the caption says the same in words.
export function PropagationDiagram({ propagation }: PropagationDiagramProps) {
  return (
    <figure className="flex flex-col gap-5">
      <svg
        data-network
        aria-hidden="true"
        viewBox={`0 0 ${String(BOX.width)} ${String(BOX.height)}`}
        className="w-full overflow-visible propagation-timeline"
      >
        <g className="stroke-border" strokeWidth={1}>
          {NETWORK.edges.flat().map((edge) => (
            <line
              key={`${String(edge.x1)}:${String(edge.y1)}:${String(edge.x2)}:${String(edge.y2)}`}
              {...edge}
            />
          ))}
        </g>
        {NETWORK.edges.map((edges, layer) => (
          <g
            key={`forward-${String(layer)}`}
            style={{
              '--from': FORWARD_START + layer * STEP,
              '--to': FORWARD_START + (layer + 1) * STEP,
            }}
            className="propagate stroke-accent"
            strokeWidth={1.5}
          >
            {edges.map((edge) => (
              <line
                key={`${String(edge.x1)}:${String(edge.y1)}:${String(edge.x2)}:${String(edge.y2)}`}
                {...edge}
              />
            ))}
          </g>
        ))}
        {NETWORK.edges.map((edges, layer) => {
          const step = NETWORK.edges.length - 1 - layer;
          return (
            <g
              key={`backward-${String(layer)}`}
              style={{
                '--from': BACKWARD_START + step * STEP,
                '--to': BACKWARD_START + (step + 1) * STEP,
              }}
              className="propagate stroke-fg"
              strokeWidth={1}
              strokeDasharray="4 5"
            >
              {edges.map((edge) => (
                <line
                  key={`${String(edge.x1)}:${String(edge.y1)}:${String(edge.x2)}:${String(edge.y2)}`}
                  {...edge}
                />
              ))}
            </g>
          );
        })}
        {NETWORK.nodes.map(({ layer, x, y }) => (
          <circle
            key={`${String(layer)}:${String(y)}`}
            data-neuron
            cx={x}
            cy={y}
            r={8}
            className="fill-canvas stroke-fg-muted"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <figcaption className="flex flex-col gap-2 text-small text-fg-muted">
        <span className={LEGEND_ROW_CLASS_NAME}>
          <span aria-hidden="true" className="mt-2.5 h-0.5 w-8 shrink-0 bg-accent" />
          {propagation.forward}
        </span>
        <span className={LEGEND_ROW_CLASS_NAME}>
          <span
            aria-hidden="true"
            className="mt-2.5 w-8 shrink-0 border-t border-dashed border-fg"
          />
          {propagation.backward}
        </span>
      </figcaption>
    </figure>
  );
}
