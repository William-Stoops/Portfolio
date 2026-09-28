// What the site's own configuration guarantees, as the behind-the-scenes page states it.
// A test checks every number against that configuration (data/site-facts.test.ts).
export type SiteFacts = {
  // Budgets of what ships, compressed with brotli, in kilobytes (.size-limit.json).
  budgets: { initialJs: number; css: number };
  // The thresholds of Lighthouse CI (lighthouserc.json): scores out of 100, then limits.
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    largestContentfulPaintMs: number;
    cumulativeLayoutShift: number;
    totalBlockingTimeMs: number;
  };
  // Minimum test coverage, in percent (vitest.config.ts).
  coverage: { lines: number; branches: number };
  // Device profiles every end-to-end test runs on (playwright.config.ts).
  devices: number;
  // Architecture decision records (docs/adr).
  decisions: number;
};
