// The grid the lab solves (ADR 0036): 48 strikes around a spot of 100, 32 maturities from a
// month to two years. Plain numbers, so the page's words can count its points without
// bringing the solver along.
export const SURFACE_GRID = {
  strikes: 48,
  maturities: 32,
  strikeMin: 70,
  strikeMax: 130,
  maturityMin: 0.08,
  maturityMax: 2,
} as const;
