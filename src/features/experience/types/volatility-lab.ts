// What the surface writes on its own axes, in the page's language.
export type SurfaceAxes = {
  strikeTitle: string;
  maturityTitle: string;
  maturityTicks: readonly { years: number; label: string }[];
};

// The four ways the lab's buttons (and the arrow keys) turn the surface.
export type SurfaceTurn = 'left' | 'right' | 'up' | 'down';

// A point of the surface read under the pointer.
export type SurfaceReading = { sigma: number; strike: number; maturity: number };

// The lab of the IT-Finance role (ADR 0036): the implied volatility surface, solved in the
// visitor's browser, and its words.
export type VolatilityLabContent = {
  overline: string;
  title: string;
  explanation: string;
  // "1 536 volatilities found by Newton-Raphson", "in 0.73 ms" once measured, then where.
  measure: { solved: string; duration: (milliseconds: number) => string; where: string };
  legend: { low: string; high: string };
  hint: string;
  // The figure's name, and what it shows for those who do not see it.
  figure: string;
  description: string;
  axes: SurfaceAxes;
  // The buttons that turn the surface, and their group.
  turn: { legend: string } & Readonly<Record<SurfaceTurn, string>>;
  readout: {
    sigma: (sigma: number) => string;
    strike: (strike: number) => string;
    maturity: (years: number) => string;
  };
};
