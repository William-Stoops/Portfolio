// The lowest and highest volatility of the lab's surface, for the legend the prerendered
// page prints before any script runs. The market is simulated and fixed, so the range is
// too; utils/volatility-grid.test.ts solves the surface and holds these to it.
export const VOLATILITY_RANGE = { low: 0.1546, high: 0.2964 } as const;
